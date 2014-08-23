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
    depth: false,
    stencil: false,
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

  gl.clearColor(0, 0, 0, 1);
  global.gl = gl;

  return true;
}

/**
 * Animation loop.
 */
Game.prototype.Tick = function() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var now = this.now();
  this.delta_time_ = now - this.last_time_;
  this.last_time_ = now;

  // TODO: do cool stuff here

  window.requestAnimationFrame(this.Tick.bind(this));
}

global.Game = Game;

})(window);
