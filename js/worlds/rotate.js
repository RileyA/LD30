(function(global) {

/** Pretty tame and blue. */
function RotateWorld(game, material, idx) {
  this.game_ = game;
  this.material_ = material;
  this.i = idx;
  // We'll only do one portal every other tunnel chunk.
  this.last_portal_ = false;
}

RotateWorld.prototype.Generate = function(tunnel, progress) {
  var portaled = false;
  for (var t = 0.1; t < 0.89; t += 0.2) {
    if (!tunnel.children_[this.i])
      tunnel.children_[this.i] = new Array();
    var r = Math.random();
    if (r < 0.3) {
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
    } else if (r < 0.8 && !portaled && !this.last_portal_) {
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
        this.material_, pos, ori, w, this.game_.worlds_[this.i]));
    }
  }

  if (!portaled) 
    this.last_portal_ = false;
}

RotateWorld.prototype.name = function() { return 'Rotate'; }

RotateWorld.prototype.min_progress = function() {
  return 10;
}

RotateWorld.prototype.material = function() {
  return this.material_;
}

global.RotateWorld = RotateWorld;

})(window);

