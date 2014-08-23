(function(global) {

/**
 * This is a renderable chunk of geometry.
 */
function Mesh(vbo, ibo) {
  this.vbo_ = gl.createBuffer();
  this.ibo_ = gl.createBuffer();
  this.initialized_ = false;
  if (vbo && ibo)
    this.Init(vbo, ibo);
}

/**
 * Creates a mesh from Typed Arrays.
 * Assume positions and normals, and tris only.
 */
Mesh.prototype.Init = function(vbo, ibo) {
  this.num_verts_ = vbo.length / 6;
  this.num_indices_ = ibo.length;
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_);
  gl.bufferData(gl.ARRAY_BUFFER, vbo, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo_);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ibo, gl.STATIC_DRAW);
  this.initialized_ = true;
}

global.Mesh = Mesh;

})(window);
