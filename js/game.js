
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

  this.view_ = mat4.create();
  this.modelview_ = mat4.create();
  this.paused_ = false;

  this.playerpos = vec3.create();
  this.lives_ = 3;
  this.stopped_ = false;

  this.roll_ = 0;

  this.k_down = false;
  this.k_up = false;
  this.k_left = false;
  this.k_right = false;
  this.k_w = false;
  this.k_a = false;
  this.k_s = false;
  this.k_d = false;
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
      this.paused_ = false;
    } else {
      this.paused_ = true;
    }
  }

  document.addEventListener('pointerlockchange', changeCallback.bind(this), false);
  document.addEventListener('mozpointerlockchange', changeCallback.bind(this), false);
  document.addEventListener('webkitpointerlockchange', changeCallback.bind(this), false);

  document.querySelector('canvas').addEventListener('mousemove', function(e) {
    if (!this.paused_) {
      var invert = 1;
      if (this.world_idx_ == 3) invert = -1;
      this.cam_x += (e.movementX || e.mozMovementX ||
                     e.webkitMovementX || 0) * kSensitivity;
      this.cam_y += (e.movementY || e.mozMovementY ||
                     e.webkitMovementY || 0) * kSensitivity * invert;
    }
  }.bind(this));

  this.canvas_.requestPointerLock = this.canvas_.requestPointerLock ||
             this.canvas_.mozRequestPointerLock ||
             this.canvas_.webkitRequestPointerLock;
  this.canvas_.requestPointerLock();

  document.querySelector('canvas').addEventListener('mousedown', function(e) {
    if (this.lives_ > 0) {
      this.canvas_.requestPointerLock = this.canvas_.requestPointerLock ||
                 this.canvas_.mozRequestPointerLock ||
                 this.canvas_.webkitRequestPointerLock;
      this.canvas_.requestPointerLock();
    }
  }.bind(this));

  document.querySelector('body').addEventListener('keydown', function(e) {
    if (e.keyCode == 32) {
      this.world_idx_ = 3;
      this.current_world_ = this.worlds_[this.world_idx_];
    }

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

  }.bind(this));

  document.querySelector('body').addEventListener('keyup', function(e) {
    if (e.keyCode == 32) {
      this.world_idx_ = 0;
      this.current_world_ = this.worlds_[this.world_idx_];
    }

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
  }.bind(this));

  this.paused_ = true;

  this.player_speed_ = 50;

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

  document.querySelector('audio').volume = 0.0;

  var now = this.now();
  this.delta_time_ = now - this.last_time_;
  this.last_time_ = now;

  if (this.paused_)
    this.delta_time_ = 0;

  if (this.delta_time_ > 100)
    this.delta_time_ = 100;

  this.player_speed_ += this.delta_time_ / 5000;

  if (this.world_idx_next_ >= 0) {
    this.world_idx_ = this.world_idx_next_;
    this.world_idx_next_ = -1;
  }

  var old_pos = vec3.clone(this.playerpos);
  var motion = this.delta_time_ / 1000 * this.player_speed_;
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

  if (this.lives_ <= 0) {
    document.exitPointerLock = document.exitPointerLock    ||
                               document.mozExitPointerLock ||
                               document.webkitExitPointerLock;
    document.exitPointerLock();
    var o = document.getElementById('overlay');
    o.style.display = 'block';
    o.style.width = this.width + 'px';
    o.style.height = this.height + 'px';
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

global.Game = Game;

})(window);
