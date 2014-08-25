(function(global) {

function Pickup(mesh, material, pos, ori) {
  this.mesh_ = mesh;
  this.material_ = material;

  this.pos_ = pos;

  //if (Math.random() > 0.5)
  //  this.square_ = true;

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

Pickup.prototype.Update = function() {
  // TODO collision detection!
}

Pickup.prototype.Draw = function(game) {
  if (this.collected_)
    return;
  
  if (global_clip < this.transform_[14])
    return;

  if (stencil_val == -1 && !this.collected_) {
    var pos = vec3.clone(game.camera_.position_);
    if (vec3.squaredDistance(this.pos_, pos) < 3.5) {
      this.collected_ = true;
      new Sfx('audio/pickup2.wav', 0.6);
      var s = 500;
      if (game.world_idx_ == 1) s = 650;
      if (game.world_idx_ == 2) s = 750;
      if (game.world_idx_ == 3) s = 1000;
      game.AddScore(s, 'Shape, ' + ['Blue', 'Red', 'Green', 'Yellow'][game.world_idx_]);
      game.combo_.shapes[game.world_idx_]++;
      game.CheckCombo();
    }
  }

  mat4.rotateY(this.transform_, this.transform_, game.delta_time_ / (700 - Math.random() * 100));
  mat4.rotateX(this.transform_, this.transform_, game.delta_time_ / (700 - Math.random() * 100));
  mat4.rotateZ(this.transform_, this.transform_, game.delta_time_ / (700 - Math.random() * 100));

  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  //gl.polygonMode( gl.FRONT_AND_BACK, gl.LINE );
  //if (this.square_) {
  //  game.Draw(game.cube_, this.material_, this.transform_);
  //} else {
    game.Draw(this.mesh_, this.material_, this.transform_);
  //}
  gl.useProgram(game.solid_.program());
  gl.uniform3f(game.solid_.program().c_uniform, 0.75, 0.75, 0.75);
  game.Draw(game.pickup_frame_, game.solid_, this.transform_);
  //gl.polygonMode( gl.FRONT_AND_BACK, gl.FILL );
  //gl.disable(gl.BLEND);
}

global.Pickup = Pickup;

})(window);
