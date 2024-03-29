(function(global) {

function Sfx(filename, volume, r) {
  this.audio_ = document.createElement('audio');
  this.audio_.src = filename;
  this.audio_.volume = volume;
  if (r)
    this.audio_.playbackRate = r;
  this.audio_.play();
  this.audio_.addEventListener('ended', this.Ended.bind(this));
}

Sfx.prototype.Ended = function(e) {
  this.audio_.removeEventListener('ended', this.Ended.bind(this));
  this.audio_.src = '';
  this.audio_ = null;
}

global.Sfx = Sfx;

})(window);
