(function(global) {

function Powerup(mesh, material, pos, ori) {
  this.mesh_ = mesh;
  this.material_ = material;

  var offset = vec3.create();
  offset[0] = Math.random() - 0.5;
  offset[1] = Math.random() - 0.5;
  vec3.normalize(offset, offset);
  vec3.scale(offset, offset, Math.random() * 8);

  vec3.transformQuat(pos, pos, ori)
  vec3.add(pos, pos, offset);

  this.transform_ = mat4.create();
  mat4.fromRotationTranslation(this.transform_, ori, pos);
}

Powerup.prototype.Update = function() {
  // TODO collision detection!
}

Powerup.prototype.Draw = function(game) {
  if (global_clip < this.transform_[14])
    return;
  game.Draw(this.mesh_, this.material_, this.transform_);
}

global.Powerup = Powerup;

})(window);
