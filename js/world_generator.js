(function(global) {

function WorldGenerator(worlds) {
  this.worlds_ = worlds;
}

WorldGenerator.prototype.Generate = function(tunnel, progress) {
  if (progress < 2)
    return;
  for (var i = 0; i < this.worlds_.length; ++i) {
    this.worlds_[i].Generate(tunnel, progress);
  }
}

global.WorldGenerator = WorldGenerator;

})(window);
