(function(global) {

var kObjectOrientationLookAhead = 0.1;

var kTunnelLen = -160;

/**
 * The main level element in the game.
 */
function Tunnel(idx, pts, rings, radius, pts_prev) {
  this.idx = idx;

  this.children_ = [];

  prev_pos = vec3.fromValues(0, 0, this.idx * kTunnelLen);

  var verts = new Float32Array(pts * 2 * (rings - 1) * 3 * 6);
  var indices = new Uint16Array(pts * 2 * (rings - 1) * 3);

  var pts_next = [];

  if (!pts_prev) {
    pts_prev = [];
    for (var i = 0; i < pts; ++i) {
      var v = vec3.create();
      var angle = (i / pts) * (Math.PI * 2.0);
      v[0] = Math.sin(angle) * radius;
      v[1] = Math.cos(angle) * radius;
      v[2] = 0.0;
      vec3.add(v, v, prev_pos);
      vec3.add(v, v, vec3.fromValues(2 * Math.random() - 1.0,
               2 * Math.random() - 1.0, 2 * Math.random() - 1.0));
      pts_prev.push(v);
    }
  }

  for (var i = 0; i < pts; ++i)
    pts_next.push(vec3.create());

  var vert_idx = 0;
  var idx_idx = 0;

  for (var i = 1; i < rings; ++i) {
    // for each face...
    next_pos = vec3.fromValues(0.0, 0.0, prev_pos[2] + (kTunnelLen / (rings - 1)));

    // Generate pts_next
    for (var j = 0; j < pts; ++j) {
      var v = pts_next[j];
      var angle = (j / pts) * (Math.PI * 2.0);
      v[0] = Math.sin(angle) * radius;
      v[1] = Math.cos(angle) * radius;
      v[2] = 0.0;
      vec3.add(v, v, next_pos);
      vec3.add(v, v, vec3.fromValues(2 * Math.random() - 1.0,
               2 * Math.random() - 1.0, 2 * Math.random() - 1.0));
    }

    function add_vert(pos, normal) {
      for (var k = 0; k < 3; ++k) {
        verts[vert_idx * 6 + k] = pos[k];
        verts[vert_idx * 6 + k + 3] = normal[k];
      }
      return vert_idx++;
    }

    // Make verts/faces.
    for (var j = 0; j < pts; ++j) {

      function make_tri(v1, v2, v3) {
        var normal = vec3.create();
        var e1 = vec3.clone(v2);
        var e2 = vec3.clone(v3);
        vec3.sub(e1, e1, v1);
        vec3.sub(e2, e2, v1);
        vec3.cross(normal, e1, e2);
        vec3.normalize(normal, normal);
        indices[idx_idx++] = add_vert(v1, normal);
        indices[idx_idx++] = add_vert(v2, normal);
        indices[idx_idx++] = add_vert(v3, normal);
      }

      var idx2 = (j + 1) % pts;
      make_tri(pts_prev[j], pts_next[j], pts_next[idx2]);
      make_tri(pts_prev[j], pts_next[idx2], pts_prev[idx2]);
    }

    var tmp = pts_prev;
    pts_prev = pts_next;
    pts_next = tmp;

    prev_pos = next_pos;
  }
  this.mesh_ = new Mesh(verts, indices);
  this.next_pts_ = pts_next;
}

Tunnel.prototype.GetTransform = function(t, v, q) {
  v[0] = 0;
  v[1] = 0;
  v[2] = kTunnelLen * t + this.idx * kTunnelLen;
  console.log(kTunnelLen * t);
}

global.Tunnel = Tunnel;

})(window);
