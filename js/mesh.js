(function(global) {

/**
 * This is a renderable chunk of geometry.
 */
function Mesh() {
  this.vbo_ = gl.createBuffer();
  this.ibo_ = gl.createBuffer();
  this.initialized_ = false;
}

/**
 * Loads a simple Wavefront OBJ mesh file.
* @param {string} file A string containing the whole file.
 */
Mesh.prototype.Load = function(file) {
  if (this.initialized_) 
    console.error('Mesh already initialized!!!');
  this.initialized_ = true;
}

/**
 * Creates a mesh from Typed Arrays.
 */
Mesh.prototype.Init = function(vbo, ibo) {
  gl.bindBuffer(this.vbo_);
  gl.bufferData(gl.ARRAY_BUFFER, vbo, gl.STATIC_DRAW);
  gl.bindBuffer(this.ibo_);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ibo, gl.STATIC_DRAW);
  this.initialized_ = true;
}

global.Mesh = Mesh;

})(window);
