(function(global) {

/**
 * The main game context.
 */
function Game(canvas) {
  /** The canvas we'll be drawing into. */
  this.canvas_ = canvas;
  this.last_time_ = 0.0;
  this.delta_time_ = 0.0;
  this.width = canvas.width;
  this.height = canvas.height;

  this.view_ = mat4.create();
  this.modelview_ = mat4.create();
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
  gl.disable(gl.STENCIL_TEST);
  //gl.depthMask(gl.TRUE);
  //gl.depthFunc(gl.LEQUAL);
  gl.viewport(0, 0, this.width, this.height);
  gl.clearColor(0, 0, 0, 1);
  global.gl = gl;

  // Some basic scene setup.
  this.camera_ = new Camera(60, this.width / this.height);
  this.proj_ = this.camera_.GetProjectionMatrix();

  this.basic_ = new Material(SHADERS.Basic.vs, SHADERS.Basic.fs,
    ['model', 'view', 'proj'], ['position', 'normal']);
  var v3 = vec3.create();
  this.cube_trans_ = mat4.create();
  mat4.translate(this.cube_trans_, this.cube_trans_, v3);

  this.materials_ = [this.basic_];
  this.playert = 0;

  this.tunnel_gen_ = new TunnelGenerator();

  return true;
}

/**
 * Animation loop.
 */
Game.prototype.Tick = function() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  var now = this.now();
  this.delta_time_ = now - this.last_time_;
  this.last_time_ = now;

  this.tunnel_gen_.AdvancePlayer(this.delta_time_ / 1000,
      this.camera_.position_, this.camera_.direction_);
  //this.camera_.direction_ = quat.create();
  this.camera_.InvalidateMatrix();

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
  
  for (var i = 0; i < this.tunnel_gen_.tunnels_.length; ++i) {
    this.Draw(this.tunnel_gen_.tunnels_[i].mesh_,
              this.basic_, this.cube_trans_, []);
  }

  window.requestAnimationFrame(this.Tick.bind(this));
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
