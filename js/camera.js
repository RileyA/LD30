(function(global) {

function Camera(fov, aspect) {
  this.position_ = vec3.create();
  this.direction_ = quat.create();
  fov = fov * Math.PI / 180.0;
  this.projection_ = mat4.create();
  mat4.perspective(this.projection_, fov, aspect, 0.1, 100.0);
  this.view_ = mat4.create();
  this.view_dirty_ = true;
  this.GetViewMatrix();
}

Camera.prototype.GetProjectionMatrix = function() {
  return this.projection_;
}

Camera.prototype.GetViewMatrix = function() {
  if (!this.view_dirty_) {
    mat4.fromRotationTranslation(this.view_, this.direction_,
                                 this.position_);
    this.view_dirty_ = false;
  }
  return this.view_;
}

Camera.prototype.InvalidateMatrix = function() {
  this.view_dirty_ = true;
}

global.Camera = Camera;

})(window);

