(function(global){

function UI() {
  this.mesh_ = new Mesh();
  this.rects_ = [];
}

UI.prototype.AddRect = function(r) {
  this.rects_.push(r);
}

UI.prototype.BuildMesh = function(r) {
  var verts = new Float32Array();
  var indices = new Uint16Array();
  var v_offset = 0;
  var i_offset = 0;
  for (var i = 0; i < this.rects_.length; ++i) {
    var r = this.rects_[i];
    verts[v_offset * 6] = r.x;
    verts[v_offset * 6 + 1] = r.y;
    verts[v_offset * 6 + 2] = 0.5;
    verts[v_offset * 6 + 3] = r.r;
    verts[v_offset * 6 + 4] = r.g;
    verts[v_offset * 6 + 5] = r.b;
    v_offset += 1;
    verts[v_offset * 6] = r.x;
    verts[v_offset * 6 + 1] = r.y + r.h;
    verts[v_offset * 6 + 2] = 0.5;
    verts[v_offset * 6 + 3] = r.r;
    verts[v_offset * 6 + 4] = r.g;
    verts[v_offset * 6 + 5] = r.b;
    v_offset += 1;
    verts[v_offset * 6] = r.x + r.w;
    verts[v_offset * 6 + 1] = r.y + r.h;
    verts[v_offset * 6 + 2] = 0.5;
    verts[v_offset * 6 + 3] = r.r;
    verts[v_offset * 6 + 4] = r.g;
    verts[v_offset * 6 + 5] = r.b;
    v_offset += 1;
    verts[v_offset * 6] = r.x + r.w;
    verts[v_offset * 6 + 1] = r.y;
    verts[v_offset * 6 + 2] = 0.5;
    verts[v_offset * 6 + 3] = r.r;
    verts[v_offset * 6 + 4] = r.g;
    verts[v_offset * 6 + 5] = r.b;
    v_offset += 1;
  }
}

global.UI = UI;

})(window);
