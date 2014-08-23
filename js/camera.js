(function(global) {

function Camera() {
  this.position_ = vec3.create();
  this.direction_ = quat.create();
}

global.Camera = Camera;

})(window);

