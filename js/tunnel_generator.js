(function(global) {

var kTunnelsForward = 3;
var kTunnelsBack = 1;

var kXEntropy = 0.0;
var kYEntropy = 0.0;
var kZLength = -40;
var kSplinePts = 5;

var kTunnelLen = -160;

var kLookAhead = 0.095;

var kRings = 14;
var kPoints = 10;
var kRadius = 11.125;

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
  this.player_t_ = 0;
  this.current_tunnel_ = null;
  this.generate_count_ = 0;

  this.tunnels_ = [];
  for (var i = 0; i < kTunnelsForward + kTunnelsBack - 1; ++i) {
    this.Generate();
  }

  this.current_tunnel_ = this.tunnels_[0];
}

TunnelGenerator.prototype.Generate = function() {
  var t = new Tunnel(this.generate_count_, kPoints, kRings, kRadius,
                     this.prev_pts_);
  this.prev_pts_ = t.next_pts_;
  ++this.generate_count_;


  // Generates portals, powerups and other fun stuff.
  this.world_gen_.Generate(t, this.generate_count_);

  // Link with predecessor
  if (this.tunnels_.length)
    this.tunnels_[this.tunnels_.length - 1].next_ = t;

  this.tunnels_.push(t);

  if (this.tunnels_.length > kTunnelsForward + kTunnelsBack)
    this.tunnels_.shift();
}

TunnelGenerator.prototype.AdvancePlayer = function(amount) {
  this.player_t_ += amount;
  if (this.player_t_ < kTunnelLen) {
    this.player_t_ -= kTunnelLen;
    this.current_tunnel_ = this.tunnels_[1];
    this.Generate();
  }
}

global.TunnelGenerator = TunnelGenerator;

})(window);
