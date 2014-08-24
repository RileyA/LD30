(function(global) {

var kTunnelsForward = 3;
var kTunnelsBack = 1;

var kXEntropy = 0.0;
var kYEntropy = 0.0;
var kZLength = -40;
var kSplinePts = 5;

var kLookAhead = 0.095;

var kRings = 14;
var kPoints = 10;
var kRadius = 10;

function gen_point() {
  var pt = vec3.fromValues(
    (Math.random() - 0.5) * 2.0 * kXEntropy,
    (Math.random() - 0.5) * 2.0 * kYEntropy,
    kZLength
    );
  vec3.normalize(pt, pt);
  vec3.scale(pt, pt, -kZLength);
  return pt;
}

function angle_between(q, v1, v2) {
  var w = vec3.create();
  vec3.cross(w, v1, v2);
  q[3] = 1.0 + vec3.dot(v1, v2);
  q[0] = w[0];
  q[1] = w[1];
  q[2] = w[2];
  quat.normalize(q, q);
  return q;
}

function TunnelGenerator(world_gen) {
  this.world_gen_ = world_gen;
  this.player_t_ = 0.5;
  this.current_tunnel_ = null;

  this.last_spline_pt_ = vec3.create();
  this.next_last_spline_pt_ = vec3.create();
  this.next_next_last_spline_pt_ = vec3.create();
  this.prev_ori_ = quat.create();

  this.tunnels_ = [];
  for (var i = 0; i < kTunnelsForward + kTunnelsBack; ++i) {
    this.Generate();
  }

  this.current_tunnel_ = this.tunnels_[0];
  this.generate_count_ = 0;
}

TunnelGenerator.prototype.Generate = function() {
  var s = new Spline();

  ++this.generate_count_;

  // It's 4am and this is terribad... dat c1 continuity doe.
  s.AddPoint(this.next_next_last_spline_pt_);
  s.AddPoint(this.next_last_spline_pt_);
  s.AddPoint(this.last_spline_pt_);

  for (var i = 0; i < kSplinePts - 1; ++i) {
    var v = gen_point();
    vec3.add(v, v, this.last_spline_pt_);
    s.AddPoint(v);
    this.next_next_last_spline_pt_ = this.last_spline_pt_;
    this.next_last_spline_pt_ = this.last_spline_pt_;
    this.last_spline_pt_ = v;
  }

  var t = new Tunnel(s, kPoints, kRings, kRadius, this.prev_ori_,
                     this.prev_pts_);
  this.prev_ori_ = t.next_ori_;
  this.prev_pts_ = t.next_pts_;

  // Generates portals, powerups and other fun stuff.
  this.world_gen_.Generate(t, this.generate_count_);

  // Link with predecessor
  if (this.tunnels_.length)
    this.tunnels_[this.tunnels_.length - 1].next_ = t;

  this.tunnels_.push(t);

  if (this.tunnels_.length > kTunnelsForward + kTunnelsBack)
    this.tunnels_.shift();
}

TunnelGenerator.prototype.AdvancePlayer = function(amount, v, q) {
  this.player_t_ += amount;

  if (this.player_t_ > 1.0) {
    this.player_t_ -= 1.0;
    this.current_tunnel_ = this.tunnels_[1];
    this.Generate();
  }

  var current = this.current_tunnel_.spline_.GetPosition(this.player_t_, v);

  var next_t = this.player_t_ + kLookAhead;
  var next_tunnel = this.current_tunnel_;

  if (next_t > 1.0) {
    next_t -= 1.0;
    next_tunnel = this.tunnels_[1];
  }

  var next = next_tunnel.spline_.GetPosition(next_t);

  angle_between(q, current, next);

  return current;
}

global.TunnelGenerator = TunnelGenerator;

})(window);
