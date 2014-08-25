
var portal_renders = new Array();
var kMaxPortalDepth = 1;
var global_clip = -100;
var global_clips = [];
var stencil_val = -1;

function pick_world(idx, worlds, progress) {
  var options = [];
  for (var i = 0; i < worlds.length; ++i) {
    if (i != idx && worlds[i].min_progress() <= progress) {
      options.push(i);
    }
  }

  if (options.length == 0) {
    return null;
  } else {
    return worlds[options[Math.floor(options.length * Math.random())]];
  }
}

(function(global) {

var kSensitivity = 0.005;

/**
 * The main game context.
 */
function Game(canvas) {
  /** The canvas we'll be drawing into. */
  this.canvas_ = canvas;
  this.last_time_ = 0.0;
  this.delta_time_ = 0.0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 80;
  this.width = canvas.width;
  this.height = canvas.height;

  this.popups_ = [];

  this.worlds_explored_ = [0, 0, 0, 0];

  this.multiplier_ = 1;

  this.view_ = mat4.create();
  this.modelview_ = mat4.create();
  this.lost_mouse_ = false;

  this.playerpos = vec3.create();
  this.lives_ = 3;
  document.getElementById('lives_val').textContent = this.lives_;
  document.getElementById('lives_val').style.color = 'white';
  this.stopped_ = false;

  this.roll_ = 0;

  this.started_ = false;
  this.ended_ = false;

  this.k_down = false;
  this.k_up = false;
  this.k_left = false;
  this.k_right = false;
  this.k_w = false;
  this.k_a = false;
  this.k_s = false;
  this.k_d = false;

  //this.score_timer_ = 0.0;
  this.tick_timer_ = 0.0;
  this.ticks = [];
  this.score_pending_ = 0.0;
  this.score_ = 0;

  this.combo_ = {
    shapes: [
      0,
      0,
      0,
      0
    ],
    one_ups: 0,
    near_misses: 0,
    portals: 0,
    multiplier: 1,
    // multiplier levels
    one_up_m: 0,
    near_miss_m: 0,
    shape_m: 0,
    portal_m: 0,
  };

  // Keep track of and clean up all the event listeners so we don't leak stuff on restarts.
  this.listeners_ = [];
}

/** 
 * Sets stuff up! Returns whether or not we succeeded.
 */
Game.prototype.Start = function() {
  // High precision timer.
  if (window.performance.now) {
    console.log("Using high performance timer");
    this.now = function() { return window.performance.now(); };
  } else {
    if (window.performance.webkitNow) {
      console.log("Using webkit high performance timer");
      this.now = function() { return window.performance.webkitNow(); };
    } else {
      console.log("Using low performance timer");
      this.now = function() { return new Date().getTime(); };
    }
  }

  if (!this.now) {
    console.error('Game timer setup failed :(');
    return false;
  }

  this.last_time_ = this.now();

  // Setup WebGL.
  var gl;
  var attributes = {
    alpha: false,
    depth: true,
    stencil: true, // portallssss :D
    antialias: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false
  };
  var names = ['webgl', 'experimental-webgl'];
  for (var n = 0; n < names.length; n++) {
    gl = this.canvas_.getContext(names[n], attributes);
    if (gl)
      break;
  }
  if (!gl) {
    console.error('WebGL setup failed :(');
    return false;
  }

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.STENCIL_TEST);
  gl.stencilMask(255);
  gl.stencilFunc(gl.ALWAYS, 255, 255);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  //gl.depthMask(gl.TRUE);
  //gl.depthFunc(gl.LEQUAL);
  gl.viewport(0, 0, this.width, this.height);
  gl.clearColor(0, 0, 0, 1);
  global.gl = gl;

  this.cube_ = new Mesh(MESHES.Cube.verts, MESHES.Cube.indices);
  this.powerup_ = new Mesh(MESHES.Powerup.verts, MESHES.Powerup.indices);
  this.pickup_ = new Mesh(MESHES.Pickup.verts, MESHES.Pickup.indices);
  this.pickup_frame_ = new Mesh(MESHES.PickupFrame.verts, MESHES.PickupFrame.indices);
  this.obstacle_ = new Mesh(MESHES.Obstacle.verts, MESHES.Obstacle.indices);
  this.portal_ = new Mesh(MESHES.Portal.verts, MESHES.Portal.indices);
  this.giant_portal_ = new Mesh(MESHES.GiantPortal.verts, MESHES.GiantPortal.indices);
  this.portal_frame_ = new Mesh(MESHES.PortalFrame.verts,
                                MESHES.PortalFrame.indices);

  // Some basic scene setup.
  this.camera_ = new Camera(50, this.width / this.height);
  this.proj_ = this.camera_.GetProjectionMatrix();

  this.start_ = new Material(SHADERS.Start.vs, SHADERS.Start.fs,
    ['model', 'view', 'proj'], ['position', 'normal']);
  this.red_ = new Material(SHADERS.Red.vs, SHADERS.Red.fs,
    ['model', 'view', 'proj'], ['position', 'normal']);
  this.yellow_ = new Material(SHADERS.Yellow.vs, SHADERS.Yellow.fs,
    ['model', 'view', 'proj'], ['position', 'normal']);
  this.ripple_ = new Material(SHADERS.Ripple.vs, SHADERS.Ripple.fs,
    ['model', 'view', 'proj', 'st'], ['position', 'normal']);
  this.solid_ = new Material(SHADERS.SolidColor.vs, SHADERS.SolidColor.fs,
    ['model', 'view', 'proj', 'c'], ['position', 'normal']);
  this.ui_ = new Material(SHADERS.UI.vs, SHADERS.UI.fs,
    [], ['position', 'normal']);
  var v3 = vec3.create();
  this.identity_ = mat4.create();
  mat4.translate(this.identity_, this.identity_, v3);

  this.materials_ = [this.start_, this.red_, this.ripple_, this.yellow_, this.solid_];

  this.worlds_ = [new StartWorld(this, this.start_, 0), 
                  new RotateWorld(this, this.red_, 1),
                  new RippleWorld(this, this.ripple_, 2),
                  new InvertWorld(this, this.yellow_, 3)];
  this.current_world_ = this.worlds_[0];
  this.world_idx_ = 0;
  this.world_idx_next_ = -1;

  this.cam_x = 0;
  this.cam_y = 0;

  this.tunnel_gen_ = new TunnelGenerator(new WorldGenerator(this.worlds_));

  function changeCallback() {
    if (document.pointerLockElement === this.canvas_ ||
        document.mozPointerLockElement === this.canvas_ ||
        document.webkitPointerLockElement === this.canvas_) {
      this.lost_mouse_ = false;
      if (!this.started_) {
        this.started_ = true;
        document.getElementById('overlay').style.display = 'none';
        document.querySelector('canvas').addEventListener('mousedown', this.RelockPointer.bind(this));
        this.listeners_.push(
          {
            elem: document.querySelector('canvas'),
            fn: this.RelockPointer.bind(this),
            evt: 'mousedown'
          });
      }
    } else {
      this.lost_mouse_ = true;
    }
  }

  document.addEventListener('pointerlockchange', changeCallback.bind(this));
  document.addEventListener('mozpointerlockchange', changeCallback.bind(this));
  document.addEventListener('webkitpointerlockchange', changeCallback.bind(this));
  this.listeners_.push(
    {
      elem: document,
      fn: changeCallback.bind(this),
      evt: 'pointerlockchange'
    });
  this.listeners_.push(
    {
      elem: document,
      fn: changeCallback.bind(this),
      evt: 'mozpointerlockchange'
    });
  this.listeners_.push(
    {
      elem: document,
      fn: changeCallback.bind(this),
      evt: 'webkitpointerlockchange'
    });


    function cam_mov(e) {
      if (!this.lost_mouse_) {
        var invert = 1;
        if (this.world_idx_ == 3) invert = -1;
        this.cam_x += (e.movementX || e.mozMovementX ||
                       e.webkitMovementX || 0) * kSensitivity;
        this.cam_y += (e.movementY || e.mozMovementY ||
                       e.webkitMovementY || 0) * kSensitivity * invert;
      }
    }

  document.querySelector('canvas').addEventListener('mousemove', cam_mov.bind(this));

  this.listeners_.push(
    {
      elem: document.querySelector('canvas'),
      fn: cam_mov.bind(this),
      evt: 'mousemove'
    });

  this.lost_mouse_ = true;
  this.crashed_ = false;
  this.crashed_speed_ = 0.0;

  // try...
  //this.RequestPointer();

  function key_down(e) {
    if (e.keyCode == 37) {
      this.k_left = true;
    } else if (e.keyCode == 38) {
      this.k_up = true;
    } else if (e.keyCode == 39) {
      this.k_right = true;
    } else if (e.keyCode == 40) {
      this.k_down = true;
    } else if (e.keyCode == 87) {
      this.k_w = true;
    } else if (e.keyCode == 65) {
      this.k_a = true;
    } else if (e.keyCode == 83) {
      this.k_s = true;
    } else if (e.keyCode == 68) {
      this.k_d = true;
    }
  }

  function key_up(e) {
    if (e.keyCode == 37) {
      this.k_left = false;
    } else if (e.keyCode == 38) {
      this.k_up = false;
    } else if (e.keyCode == 39) {
      this.k_right = false;
    } else if (e.keyCode == 40) {
      this.k_down = false;
    } else if (e.keyCode == 87) {
      this.k_w = false;
    } else if (e.keyCode == 65) {
      this.k_a = false;
    } else if (e.keyCode == 83) {
      this.k_s = false;
    } else if (e.keyCode == 68) {
      this.k_d = false;
    }
  }

  document.querySelector('body').addEventListener('keydown', key_down.bind(this));
  document.querySelector('body').addEventListener('keyup', key_up.bind(this));

  this.player_speed_ = 55;

  this.listeners_.push(
    {
      elem: document.querySelector('body'),
      fn: key_up.bind(this),
      evt: 'keyup'
    });
  this.listeners_.push(
    {
      elem: document.querySelector('body'),
      fn: key_down.bind(this),
      evt: 'keydown'
    });

  return true;
}

/**
 * Animation loop.
 */
Game.prototype.Tick = function() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  if (window.innerWidth != this.width ||
      window.innerHeight != this.height - 80) {
    this.width = window.innerWidth;
    this.height = window.innerHeight - 80;
    this.canvas_.width = this.width;
    this.canvas_.height = this.height;
    this.camera_.SetProjectionMatrix(50  * Math.PI / 180.0, this.width / this.height);
    this.proj_ = this.camera_.GetProjectionMatrix();
    gl.viewport(0, 0, this.width, this.height);
  }

  document.querySelector('audio').volume = 0.5;

  var now = this.now();
  this.delta_time_ = now - this.last_time_;
  this.last_time_ = now;

  this.tick_timer_ -= this.delta_time_ / 1000;

  if (this.tick_timer_ <= 0.0 && this.ticks.length != 0) {
    var t = document.getElementById('ticker');
    this.ticks.shift();
    if (this.ticks.length) 
      t.textContent = this.ticks[0];
    else
      t.textContent = '';
    if (this.ticks.length == 1)
      this.tick_timer_ = 1.0;
    else
      this.tick_timer_ = 0.2;
  }

  if (this.delta_time_ > 100)
    this.delta_time_ = 100;

  this.worlds_explored_[this.world_idx_] += this.delta_time_ / 1000;

  if (this.lives_ <= 0 || !this.started_)
    this.delta_time_ = 0;

  var ds = this.delta_time_ / 1000;
  for (var i = 0; i < this.popups_.length; ++i) {
    if (!this.popups_[i].update(ds)) {
      this.popups_.splice(i, 1);
      --i;
    }
  }

  if (this.player_speed_ < 200)
    this.player_speed_ += this.delta_time_ / 6000;

  if (this.world_idx_next_ >= 0) {
    this.world_idx_ = this.world_idx_next_;
    this.world_idx_next_ = -1;
  }

  var old_pos = vec3.clone(this.playerpos);

  var motion = this.delta_time_ / 1000 * this.player_speed_;

  if (this.crashed_) {
    if (!this.combo_) {
      this.combo_ = {
        shapes: [
          0,
          0,
          0,
          0
        ],
        one_ups: 0,
        near_misses: 0,
        portals: 0,
        multiplier: 1,
        // multiplier levels
        one_up_m: 0,
        near_miss_m: 0,
        shape_m: 0,
        portal_m: 0,
      }
    }

    this.crashed_speed_ += this.delta_time_ / 4000;
    if (this.crashed_speed_ >= 1.0) {
      this.crashed_ = false;
    } else {
      motion *= this.crashed_speed_;
    }
  }

  this.playerpos[2] -= motion;
  this.tunnel_gen_.AdvancePlayer(-motion);

  var invert = 1;
  if (this.world_idx_ == 3) invert = -1;
  if (this.k_left || this.k_a)
    this.cam_x -= this.delta_time_ / 60;
  if (this.k_right || this.k_d)
    this.cam_x += this.delta_time_ / 60;
  if (this.k_up || this.k_w)
    this.cam_y -= this.delta_time_ / 60 * invert;
  if (this.k_down || this.k_s)
    this.cam_y += this.delta_time_ / 60 * invert;

  var rad = Math.sqrt(this.cam_x * this.cam_x + this.cam_y * this.cam_y);
  if (rad > 8.5) {
    this.cam_x *= (8.5 / rad);
    this.cam_y *= (8.5 / rad);
  }

  var offset = vec3.create();
  offset[0] = this.cam_x;
  offset[1] = -this.cam_y;
  offset[2] = 0;

  if (this.world_idx_ == 1) {
    this.roll_ += this.delta_time_ / 2000;
  } else if (this.world_idx_ == 2) {
    this.roll_ -= this.delta_time_ / 1500;
  }

  this.camera_.direction_ = quat.create();
  quat.rotateZ(this.camera_.direction_, this.camera_.direction_, this.roll_);
  vec3.transformQuat(offset, offset, this.camera_.direction_);
  vec3.add(this.camera_.position_, this.playerpos, offset);
  this.camera_.InvalidateMatrix();
  this.last_distance = vec3.distance(old_pos, this.camera_.position_);
  mat4.copy(this.view_, this.camera_.GetViewMatrix());
  mat4.invert(this.view_, this.view_);

  // Apply view/proj matrices to all materials.
  for (var i = 0; i < this.materials_.length; ++i) {
    gl.useProgram(this.materials_[i].program());
    gl.uniformMatrix4fv(this.materials_[i].program().view_uniform, false,
                        this.view_);
    gl.uniformMatrix4fv(this.materials_[i].program().proj_uniform, false,
                        this.proj_);
  }

  //gl.stencilFunc(gl.EQUAL, 1, 255);
  this.DrawWorld(this.world_idx_);

  for (var i = 0; i < portal_renders.length; ++i) {
    global_clip = global_clips.shift();
    gl.clear(gl.DEPTH_BUFFER_BIT);// | gl.COLOR_BUFFER_BIT);
    gl.stencilFunc(gl.EQUAL, portal_renders[i] + 1, 255);
    stencil_val = portal_renders[i] + 1;
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    this.DrawWorld(portal_renders[i]);
  }

  stencil_val = -1;
  global_clip = 100;

  gl.stencilFunc(gl.ALWAYS, 255, 255);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

  portal_renders.length = 0;

  if (!this.stopped_) {
    window.requestAnimationFrame(this.Tick.bind(this));
  } else {
    return;
  }

  var o = document.getElementById('overlay');

  if (!this.started_ || this.lives_ <= 0) {
    o.style.display = 'block';
    o.style.width = this.width + 'px';
    o.style.height = this.height + 'px';
  }

  if (this.lives_ <= 0) {
    if (!this.ended_) {
      this.ended_ = true;
      for (var i = 0; i < this.popups_.length; ++i) {
        this.popups_[i].update(9999);
      }
      this.popups_ = [];
      document.getElementById('report_card').textContent = "SCORE: " + this.score_;
      function restart() {
        document.querySelector('body').removeEventListener('click', restart);
        document.querySelector('body').removeEventListener('keydown', restart);
        document.getElementById('score_val').textContent = '0';
        document.getElementById('score_mult').textContent = 'x1';
        game.stopped_ = true;

        // kill all event listeners, idk if this is necessary, but why not?
        for (var i = 0; i < game.listeners_.length; ++i) {
          var tmp = game.listeners_[i];
          tmp.elem.removeEventListener(tmp.evt, tmp.fn);
        }
        game.listeners_.length = 0;

        document.getElementById('overlay').style.display = 'none';
        game = new Game(document.querySelector('canvas'));
        game.Start();
        game.Tick();
        game.RequestPointer();
      }
      document.querySelector('body').addEventListener('click', restart);
      document.querySelector('body').addEventListener('keydown', restart);
      document.getElementById('hint').textContent = 'Hint: ' +
        ['Up and down controls are inverted in the yellow world.',
         'The level rotates in the green and red worlds.',
         'Using a trackpad? Try a mouse!',
         'Take the plunge! Use enough portals and you\'ll be awarded score multipliers!',
         'Take risks! Get enough near misses in one combo to earn score multipliers!',
         'Diversify! Get shapes from each world in one combo to unlock score multipliers!'][Math.floor(Math.random() * 6)];
      document.getElementById('infobox').style.display = 'block';
    }


    document.exitPointerLock = document.exitPointerLock    ||
                               document.mozExitPointerLock ||
                               document.webkitExitPointerLock;
    document.exitPointerLock();
  }
}

Game.prototype.DrawWorld = function(idx) {
  for (var i = 0; i < this.tunnel_gen_.tunnels_.length; ++i) {
    var t = this.tunnel_gen_.tunnels_[i];
    this.Draw(t.mesh_, this.worlds_[idx].material(), this.identity_, []);
    if (t.children_[idx]) {
      for (var j = 0; j < t.children_[idx].length; ++j) {
        t.children_[idx][j].Draw(this);
      }
    }
  }
}

/**
 * Helper that draws a mesh with a given set of properties.
 */
Game.prototype.Draw = function(mesh, material, transform, uniforms) {
  gl.useProgram(material.program());
  gl.uniformMatrix4fv(material.program().model_uniform, false, transform);

  // TODO set other uniforms.

  // Bind buffer objects.
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo_);

  // Enable and set attrib pointers.
  gl.enableVertexAttribArray(material.program().position_attribute);
  gl.enableVertexAttribArray(material.program().normal_attribute);
  gl.vertexAttribPointer(material.program().position_attribute, 3, gl.FLOAT,
                         false, 24, 0);
  gl.vertexAttribPointer(material.program().normal_attribute, 3, gl.FLOAT,
                         false, 24, 12);

  // Actually do the draw.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo_);
  gl.drawElements(gl.TRIANGLES, mesh.num_indices_, gl.UNSIGNED_SHORT, 0);

  // Disable.
  gl.disableVertexAttribArray(material.program().position_attribute);
  gl.disableVertexAttribArray(material.program().normal_attribute);
}

Game.prototype.AddScore = function(pts, description) {
  this.score_pending_ += pts * this.multiplier_;
  //this.score_timer_ = 1.5;
  var delta = document.getElementById('score_delta');
  delta.textContent = '+' + this.score_pending_;

  var txt = description + ' (+' + pts + ')';

  if (this.multiplier_ > 1) {
    txt += ' x ' + this.multiplier_ + ' = ' + this.multiplier_ * pts;
  }

  this.popups_.push(
    new Popup(txt, 20, 60, 255, 100,
    2, document.querySelector('canvas').parentNode));

  var goodness = Math.max(this.score_pending_ / 10000 + 0.3, 1.0);
  delta.style.color = 'rgb(' + Math.round(goodness * 50) + ',' +
   Math.round(goodness * 250) + ',' + Math.round(goodness * 80) + ')';

  //this.ticks.push(description + '(+' + pts + ')');
  //if (this.ticks.length == 1) {
  //  this.tick_timer_ = 1.0;
  //  var t = document.getElementById('ticker').textContent = this.ticks[0];
  //} else if (this.tick_timer > 0.2) {
  //  this.tick_timer_ = 0.2;
  //}
}

Game.prototype.AddMultiplier = function(m, description) {
  this.score_pending_ += this.score_pending_ * m;
  var delta = document.getElementById('score_delta');
  delta.textContent = '+' + this.score_pending_;
  var goodness = Math.max(this.score_pending_ / 10000 + 0.3, 1.0);
  delta.style.color = 'rgb(' + Math.round(goodness * 50) + ',' +
   Math.round(goodness * 250) + ',' + Math.round(goodness * 80) + ')';

  new Sfx("audio/multiplier.wav", 1.0);
  this.multiplier_ += m;
  document.getElementById('score_mult').textContent = 'x' + this.multiplier_;
  this.popups_.push(
    new Popup(description + ' x' + (m + 1) + ' MULTIPLIER!!!', 40, 60, 255, 100,
    3, document.querySelector('canvas').parentNode));
}

Game.prototype.CheckCombo = function() {
  // Look for bonuses
  if (this.combo_.near_misses >= 25 && this.combo_.near_miss_m < 1) {
    this.AddMultiplier(1, 'Lucky!');
    this.combo_.near_miss_m = 1;
    document.getElementById('nm_d').textContent = 50;
    document.getElementById('nm').style.backgroundColor = '#113322';
  } else if (this.combo_.near_misses >= 50 && this.combo_.near_miss_m < 2) {
    this.AddMultiplier(3, 'Reckless!');
    this.combo_.near_miss_m = 2;
    document.getElementById('nm_d').textContent = 100;
    document.getElementById('nm').style.backgroundColor = '#226644';
  } else if (this.combo_.near_misses >= 100 && this.combo_.near_miss_m < 3) {
    this.AddMultiplier(7, 'Catlike :3');
    this.combo_.near_miss_m = 3;
    document.getElementById('nm').style.backgroundColor = '#338855';
  }

  document.getElementById('nm_n').textContent = this.combo_.near_misses;
  document.getElementById('p_n').textContent = this.combo_.portals;

  if (this.combo_.portals >= 10 && this.combo_.portal_m < 1) {
    this.AddMultiplier(1, 'Thinking with Portals.');
    this.combo_.portal_m = 1;
    document.getElementById('p_d').textContent = 25;
    document.getElementById('p').style.backgroundColor = '#113322';
  } else if (this.combo_.portals >= 25 && this.combo_.portal_m < 2) {
    this.AddMultiplier(3, 'Aperture what?');
    this.combo_.portal_m = 2;
    document.getElementById('p_d').textContent = 50;
    document.getElementById('p').style.backgroundColor = '#226644';
  } else if (this.combo_.portals >= 50 && this.combo_.portal_m < 3) {
    this.AddMultiplier(7, 'Omnom Cake.');
    this.combo_.portal_m = 3;
    document.getElementById('p').style.backgroundColor = '#338855';
  }

  if (this.combo_.one_ups >= 5 && this.combo_.one_up_m < 1) {
    this.AddScore(10000, 'Lifeguard!');
    this.combo_.one_up_m = 1;
  } else if (this.combo_.one_ups >= 10 && this.combo_.one_up_m < 2) {
    this.AddScore(100000, 'M.D.');
    this.combo_.one_up_m = 2;
  } else if (this.combo_.one_ups >= 25 && this.combo_.one_up_m < 3) {
    this.AddScore(200000, 'Invincible!');
    this.combo_.one_up_m = 3;
  }

  var lcd = 10000;
  for (var i = 0; i < 4; ++i)
    lcd = Math.min(lcd, this.combo_.shapes[i]);

  document.getElementById('ico_b_n').textContent = this.combo_.shapes[0];
  document.getElementById('ico_r_n').textContent = this.combo_.shapes[1];
  document.getElementById('ico_g_n').textContent = this.combo_.shapes[2];
  document.getElementById('ico_y_n').textContent = this.combo_.shapes[3];

  if (lcd >= 25 && this.combo_.shape_m < 3) {
    this.AddMultiplier(7, 'Multifarious!');
    this.combo_.shape_m = 3;
    document.getElementById('ico').style.backgroundColor = '#338855';
  } else if (lcd >= 10 && this.combo_.shape_m < 2) {
    this.AddMultiplier(3, 'Diversification!');
    this.combo_.shape_m = 2;
    document.getElementById('ico_b_d').textContent = 25;
    document.getElementById('ico_r_d').textContent = 25;
    document.getElementById('ico_g_d').textContent = 25;
    document.getElementById('ico_y_d').textContent = 25;
    document.getElementById('ico').style.backgroundColor = '#226644';
  } else if (lcd >= 1 && this.combo_.shape_m < 1) {
    this.AddMultiplier(1, 'Variety!');
    this.combo_.shape_m = 1;
    document.getElementById('ico_b_d').textContent = 10;
    document.getElementById('ico_r_d').textContent = 10;
    document.getElementById('ico_g_d').textContent = 10;
    document.getElementById('ico_y_d').textContent = 10;
    document.getElementById('ico').style.backgroundColor = '#113322';
  }
}

Game.prototype.RequestPointer = function() {
  this.canvas_.requestPointerLock = this.canvas_.requestPointerLock ||
             this.canvas_.mozRequestPointerLock ||
             this.canvas_.webkitRequestPointerLock;
  this.canvas_.requestPointerLock();
}

Game.prototype.RelockPointer = function() {
  if (this.lives_ > 0 && this.started_) {
    this.canvas_.requestPointerLock = this.canvas_.requestPointerLock ||
               this.canvas_.mozRequestPointerLock ||
               this.canvas_.webkitRequestPointerLock;
    this.canvas_.requestPointerLock();
  }
}

Game.prototype.ApplyScore = function() {
  //this.score_timer_ = 0;
  this.score_ += this.score_pending_;// * this.multiplier_;
  this.multiplier_ = 1;
  this.score_pending_ = 0;
  var sc = document.getElementById('score_val');
  sc.textContent = this.score_;
  var delta = document.getElementById('score_delta');
  delta.textContent = '+' + this.score_pending_;
  delta.style.color = '#3f3f3f';
  this.combo_ = {
    shapes: [
      0,
      0,
      0,
      0
    ],
    one_ups: 0,
    near_misses: 0,
    portals: 0,
    multiplier: 1,
    // multiplier levels
    one_up_m: 0,
    near_miss_m: 0,
    shape_m: 0,
    portal_m: 0,
  }
  this.multiplier_ = 1;
  document.getElementById('score_mult').textContent = 'x1';
}

global.Game = Game;

})(window);
