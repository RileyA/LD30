(function(global) {

function Obstacle(mesh, material, pos, ori) {
  this.mesh_ = mesh;
  this.material_ = material;

  quat.rotateZ(ori, ori, Math.random() * Math.PI);


  var offset = vec3.create();
  offset[0] = Math.random() - 0.5;
  offset[1] = Math.random() - 0.5;
  vec3.normalize(offset, offset);
  vec3.scale(offset, offset, Math.random() * 8);

  vec3.transformQuat(pos, pos, ori)
  vec3.add(pos, pos, offset);

  this.ori_ = ori;
  this.pos_ = pos;

  this.transform_ = mat4.create();
  mat4.fromRotationTranslation(this.transform_, ori, pos);
}

Obstacle.prototype.Update = function() {
}

Obstacle.prototype.Draw = function(game) {

  // collision check
  var pos = game.camera_.position_;


  if (global_clip < this.transform_[14])
    return;
  game.Draw(this.mesh_, this.material_, this.transform_);
}

global.Obstacle = Obstacle;

})(window);
