(function(global) {

/** Pretty tame and blue. */
function RippleWorld(game, material, idx) {
  this.game_ = game;
  this.material_ = material;
  this.i = idx;
  // We'll only do one portal every other tunnel chunk.
  this.last_portal_ = false;
}

RippleWorld.prototype.Generate = function(tunnel, progress) {
  var portaled = false;
  for (var t = 0.2; t < 0.9; t += 0.2) {
    if (!tunnel.children_[this.i])
      tunnel.children_[this.i] = new Array();
    var r = Math.random();
    if (r < 0.3 && false) {
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(t, pos, ori);
      // teehee game.cube
      tunnel.children_[this.i].push(new Powerup(this.game_.cube_,
        this.material_, pos, ori));
    } else if (r < 0.6) {
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(t, pos, ori);
      tunnel.children_[this.i].push(new Obstacle(this.game_.obstacle_,
        this.material_, pos, ori));
    } else if (r < 0.9 && !portaled && !this.last_portal_) {
      var w = pick_world(this.i, this.game_.worlds_, progress);
      if (!w) {
        continue;
      }
      portaled = true;
      this.last_portal_ = true;
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(t, pos, ori);
      // teehee game.cube
      tunnel.children_[this.i].push(new Portal(this.game_,
        this.material_, pos, ori, w, this));
    }
  }

  if (!portaled)
    this.last_portal_ = false;
}

RippleWorld.prototype.name = function() { return 'Start'; }

RippleWorld.prototype.min_progress = function() {
  return 12;
}

RippleWorld.prototype.material = function() {
  return this.material_;
}

global.RippleWorld = RippleWorld;

})(window);
