(function(global) {

function Powerup(mesh, material, pos, ori) {
  this.mesh_ = mesh;
  this.material_ = material;

  this.pos_ = pos;

  this.collected_ = false;

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
  if (this.collected_)
    return;
  
  if (global_clip < this.transform_[14])
    return;

  if (stencil_val == -1 && !this.collected_) {
    var pos = vec3.clone(game.camera_.position_);
    if (vec3.squaredDistance(this.pos_, pos) < 3.5) {
      new Sfx('audio/1up.wav', 0.8);
      this.collected_ = true;
      game.lives_++;
      document.getElementById('lives_val').style.color = 'white';
      document.getElementById('lives_val').textContent = game.lives_;
      game.AddScore(1000, '1 UP!');
      game.combo_.one_ups++;
      game.CheckCombo();
    }
  }

  mat4.rotateY(this.transform_, this.transform_, game.delta_time_ / 700);
  //mat4.rotateX(this.transform_, this.transform_, game.delta_time_ / 700);
  //mat4.rotateZ(this.transform_, this.transform_, game.delta_time_ / 700);

  gl.useProgram(game.solid_.program());
  gl.uniform3f(game.solid_.program().c_uniform, 0.9, 0.9, 0.9);
  game.Draw(game.powerup_, game.solid_, this.transform_);
}

global.Powerup = Powerup;

})(window);
