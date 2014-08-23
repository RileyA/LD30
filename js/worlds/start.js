(function(global) {

function StartWorld(material) {
  this.material_ = material;
}

StartWorld.prototype.Generate = function(tunnel, progress) {
}

StartWorld.prototype.name = function() { return 'Start'; }

StartWorld.prototype.min_progress = function() {
  return 0;
}

StartWorld.prototype.material = function() {
  return this.material_;
}

global.StartWorld = StartWorld;

})(window);
