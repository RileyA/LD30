(function(global) {

/** A piece of snazzy text that pops up and then disappears. */
function Popup(message, scale, r, g, b, life, parent_node) {
  this.r = Math.round(r);
  this.g = Math.round(g);
  this.b = Math.round(b);
  this.text = document.createElement('h2');
  this.life = life;
  this.life_start = life;
  this.text.textContent = message;
  parent_node.appendChild(this.text);
  this.text.style.color = 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  this.text.style.fontSize = scale + 'px';
  this.text.style.textAlign = 'center';
  this.text.style.opacity = 0.8;
  this.text.style.position = 'absolute';
  this.text.style.top = 20 + Math.random() * 50 + '%';
  this.text.style.left = 20 + Math.random() * 50 + '%';
  this.text.fontFamily = 'Roboto';
  this.text.fontWeight = '300';
}

Popup.prototype.update = function(delta) {
  this.life -= delta;
  if (this.life < 0) {
    this.text.parentNode.removeChild(this.text);
    this.text = null;
    return false;
  }
  this.text.style.opacity = (this.life / this.life_start) * 0.8;
  return true;
}

global.Popup = Popup;

})(window);
