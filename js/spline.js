(function(global) {

/**
 * A crappy Catmull-Rom spline implementation.
 * Guaranteed to pass through all points except the endpoints.
 * Starts and ends at the second and second to last point respectively.
 */
function Spline() {
  this.points_ = [];
}

Spline.prototype.AddPoint = function(pt) {
  this.points_.push(pt);
}

Spline.prototype.GetPosition = function(t) {
  var iF = t * (this.points_.length - 3); // ignore endpoints
  var i = Math.floor(iF);

  var r = iF - i;
  ++i;

  if (i == 0)
    return vec3.clone(this.points_[1]);
  if (i == this.points_.length - 2)
    return vec3.clone(this.points_[this.points_.length - 2]);

  //if (i <= 0 || i >= this.points_.length - 2) {
  //  console.error('Spline index out of bounds: ' + i);
  //  return;
  //}

  var c0 = ((-t + 2.0) * t - 1.0) * t * 0.5;
  var c1 = (((3.0 * t - 5.0) * t) * t + 2.0) * 0.5;
  var c2 = ((-3.0 * t + 4.0) * t + 1.0) * t * 0.5;
  var c3 = ((t - 1.0) * t * t) * 0.5;

  var out = vec3.create();
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  vec3.scaleAndAdd(out, out, this.points_[i - 1], c0);
  vec3.scaleAndAdd(out, out, this.points_[i], c1);
  vec3.scaleAndAdd(out, out, this.points_[i + 1], c2);
  vec3.scaleAndAdd(out, out, this.points_[i + 2], c3);

  return out;
}

global.Spline = Spline;

})(window);
