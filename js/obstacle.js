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
      if (d < 1.5) {
        this.hit_ = true;
        --game.lives_;
        document.getElementById('lives_val').textContent = game.lives_;
        if (game.lives_ <= 1) {
          document.getElementById('lives_val').style.color = 'red';
        }
        game.ApplyScore();
        game.score_pending_ = 0;
        game.combo_ = null;
        document.getElementById('score_delta').textContent = '+0';
        document.getElementById('score_delta').style.color = '#3f3f3f';
        document.getElementById('p').style.backgroundColor = '#2f2f2f';
        document.getElementById('nm').style.backgroundColor = '#2f2f2f';
        document.getElementById('ico').style.backgroundColor = '#2f2f2f';
        document.getElementById('p_n').textContent = '0';
        document.getElementById('nm_n').textContent = '0';
        document.getElementById('p_d').textContent = '10';
        document.getElementById('nm_d').textContent = '25';
        document.getElementById('ico_b_n').textContent = '0';
        document.getElementById('ico_r_n').textContent = '0';
        document.getElementById('ico_g_n').textContent = '0';
        document.getElementById('ico_y_n').textContent = '0';
        document.getElementById('ico_b_d').textContent = '1';
        document.getElementById('ico_r_d').textContent = '1';
        document.getElementById('ico_g_d').textContent = '1';
        document.getElementById('ico_y_d').textContent = '1';

        if (game.lives_ <= 0) {
          game.paused_ = true;
          new Sfx('audio/die.wav', 0.8);
        } else {
          new Sfx('audio/crash.wav', 0.8);
          game.crashed_ = true;
          game.crashed_speed_ = 0.0;
          game.player_speed_ = (game.player_speed_ - 60) / 2 + 60;

          var fails = [
            'C-C-C-Combo Broken (Lives -1)',
            'Owww! (Lives -1)',
          ];

          game.popups_.push(
            new Popup(fails[Math.floor(Math.random() * fails.length)], 35, 240, 50, 60,
            3, document.querySelector('canvas').parentNode));
        }
      } else if (d < 10) {
        this.close_ = true;
      }

      if (!this.closed_ && this.close_ && !this.hit_ && pos[2] - this.pos_[0] < -5.0) {
        this.closed_ = true;
        new Sfx("audio/near_miss.wav", 0.8); // TODO
        game.AddScore(250, 'Near Miss!');
        game.combo_.near_misses++;
        game.CheckCombo();
      }
    }
  }

  if (!this.hit_)
    game.Draw(this.mesh_, this.material_, this.transform_);
}

global.Obstacle = Obstacle;

})(window);
