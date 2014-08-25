(function(global) {

/** Pretty tame and blue. */
function RotateWorld(game, material, idx) {
  this.game_ = game;
  this.material_ = material;
  this.i = idx;
  // We'll only do one portal every other tunnel chunk.
  this.last_portal_ = true;
}

RotateWorld.prototype.Generate = function(tunnel, progress) {
  if (!tunnel.children_[this.i])
    tunnel.children_[this.i] = new Array();

  var spots = [40.0 / 160.0,
               60.0 / 160.0,
               100.0 / 160.0,
              120.0 / 160.0,
              140.0 / 160.0];

  for (var i = 0; i < spots.length; ++ i) {
    var r = Math.random();
    if (r < 0.6) {
      if (this.game_.worlds_explored_[this.i] > 2) {
        var pos = vec3.create();
        var ori = quat.create();
        tunnel.GetTransform(spots[i], pos, ori);
        tunnel.children_[this.i].push(new Obstacle(this.game_.obstacle_,
          this.material_, pos, ori));
      }
    } else if (r < 0.85) {
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(spots[i], pos, ori);
      tunnel.children_[this.i].push(new Pickup(this.game_.pickup_,
        this.material_, pos, ori));
    } else if (r < 0.825) {
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(spots[i], pos, ori);
      tunnel.children_[this.i].push(new Powerup(this.game_.cube_,
        this.material_, pos, ori));
    }
  }

  if (progress % 2 == 0 && this.game_.worlds_explored_[this.i] > 4) {
    var w = pick_world(this.i, this.game_.worlds_, progress);
    if (w) {
      this.last_portal_ = true;
      this.last_portal_ = true;
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(5.0 / 160.0, pos, ori);
      // teehee game.cube
      tunnel.children_[this.i].push(new Portal(this.game_,
        this.material_, pos, ori, w, this.game_.worlds_[this.i]));
    }
  } else {
    this.last_portal_ = false;
  }

  /*for (var t = 0.1; t < 0.89; t += 0.2) {
    var r = Math.random();
    if (r < 0.1) {
      var pos = vec3.create();
      var ori = quat.create();
      tunnel.GetTransform(t, pos, ori);
      tunnel.children_[this.i].push(new Pickup(this.game_.pickup_,
        this.material_, pos, ori));
    } else if (r < 0.11) {
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
    } else if (r < 1.0 && !portaled && !this.last_portal_) {
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
  }*/
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

