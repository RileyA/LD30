(function(global) {

function Powerup(mesh, material) {
  this.mesh_ = mesh;
  this.material_ = material;
}

Powerup.prototype.Update = function() {
  // TODO collision detection!
}

Powerup.prototype.Draw = function(game, transform) {
  game.Draw(this.mesh_, this.material_, transform);
}

global.Powerup = Powerup;

})(window);
