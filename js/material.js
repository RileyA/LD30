(function(global) {

/**
 * Represents a material with which an object can be rendered.
 * Pretty much just holds onto a shader and relevant info.
 */
function Material(vs, fs, uniforms, attrs) {
  function CompileShader(text, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  this.vertex_shader_ = CompileShader(vs, gl.VERTEX_SHADER);
  this.fragment_shader_ = CompileShader(fs, gl.FRAGMENT_SHADER);

  this.program_ = gl.createProgram();
  gl.attachShader(this.program_, this.vertex_shader_);
  gl.attachShader(this.program_, this.fragment_shader_);
  gl.linkProgram(this.program_);

  if (!gl.getProgramParameter(this.program_, gl.LINK_STATUS)) {
    console.error('Shader init failed!');
  }

  for (var i = 0; i < attrs.length; ++i) {
    this.program_[attrs[i] + "_attribute"] = gl.getAttribLocation(
        this.program_, attrs[i]);
  }

  for (var i = 0; i < uniforms.length; ++i) {
    this.program_[uniforms[i] + '_uniform'] =
        gl.getUniformLocation(this.program_, uniforms[i]);
  }
}

Material.prototype.program = function() {
  return this.program_;
}

global.Material = Material;

})(window);
