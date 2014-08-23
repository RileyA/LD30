(function(global) {

var kObjectOrientationLookAhead = 0.1;

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

/**
 * The main level element in the game.
 */
function Tunnel(spline, pts, rings, radius, prev_ori, pts_prev) {
  this.spline_ = spline;

  prev_pos = spline.GetPosition(0.0);
  next_ori = quat.create();

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
      vec3.transformQuat(v, v, prev_ori);
      vec3.add(v, v, prev_pos);
      vec3.add(v, v, vec3.fromValues(Math.random() - 0.5,
               Math.random() - 0.5, 0.0));
      pts_prev.push(v);
    }
  }

  for (var i = 0; i < pts; ++i)
    pts_next.push(vec3.create());

  var vert_idx = 0;
  var idx_idx = 0;

  for (var i = 1; i < rings; ++i) {
    // for each face...
    next_pos = spline.GetPosition(i / (rings - 1));
    angle_between(next_ori, prev_pos, next_pos);
    
    // Generate pts_next
    for (var j = 0; j < pts; ++j) {
      var v = pts_next[j];
      var angle = (j / pts) * (Math.PI * 2.0);
      v[0] = Math.sin(angle) * radius;
      v[1] = Math.cos(angle) * radius;
      v[2] = 0.0;
      vec3.transformQuat(v, v, next_ori);
      vec3.add(v, v, next_pos);
    vec3.add(v, v, vec3.fromValues(Math.random() - 0.5, Math.random() - 0.5, 0.0));
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
  this.next_ori_ = next_ori;
}

Tunnel.prototype.GetTransform = function(t) {
  function lookup_pos(t) {
    var tn = this;
    while (t > 1.0) {
      if (tn.next) {
        t -= 1.0;
        tn = this.next_;
      } else {
        t = 1.0;
      }
    }
    return tn.spline_.GetPosition(t);
  }
  var pos = lookup_pos(t);
  var pos_next = lookup_pos(t + kObjectOrientationLookAhead);

  var q = quat.create();
  angle_between(q, pos, pos2);

  return mat4.fromRotationTranslation(out, q, pos);
}

global.Tunnel = Tunnel;

})(window);
