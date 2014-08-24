(function(global) {

var ob_center = vec3.fromValues(0, 0, 0.0);

function Obstacle(mesh, material, pos, ori) {
  this.mesh_ = mesh;
  this.material_ = material;

  this.hit_ = false;
  this.close_ = false;
  this.closed_ = false;

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

  this.itrans_ = mat4.create();
  mat4.invert(this.itrans_, this.transform_);
}

Obstacle.prototype.Update = function() {
}

Obstacle.prototype.Draw = function(game) {
  if (global_clip < this.transform_[14])
    return;

  if (stencil_val == -1) {
    var pos = vec3.clone(game.camera_.position_);
    if (!this.hit_) {
      // collision check
      vec3.transformMat4(pos, pos, this.itrans_);
      pos[1] = 0.0;
      var d = vec3.squaredDistance(ob_center, pos);
      if (d < 2.65) {
        console.log('HIT');
        game.paused_ = true;
        this.hit_ = true;
        --game.lives_;
        document.getElementById('lives_val').textContent = game.lives_;
        if (game.lives_ <= 0) {
          new Sfx('audio/die.wav', 0.8);
        } else {
          new Sfx('audio/crash.wav', 0.8);
        }
      } else if (d < 10) {
        this.close_ = true;
      }

      if (!this.closed_ && this.close_ && !this.hit_ && pos[2] - this.pos_[0] < -5.0) {
        this.closed_ = true;
        //new Sfx("audio/nearmiss.wav", 0.5); // TODO
      }
    }
  }

  game.Draw(this.mesh_, this.material_, this.transform_);
}

global.Obstacle = Obstacle;

})(window);