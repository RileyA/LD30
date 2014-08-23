(function(global) {

var SHADERS = {
  Basic : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'uniform mat4 model;\n' +
      'uniform mat4 view;\n' +
      'uniform mat4 proj;\n' +
      'varying vec3 n;\n' +

      'void main(void) {\n' +
      '  n = normal;\n' +
      '  gl_Position = proj * model * vec4(position, 1.0);\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +

      'void main(void) {\n' +
      '  gl_FragColor = vec4(n / 2.0 + vec3(0.5, 0.5, 0.5), 1.0);\n' +
      '}\n',
  }
};

global.SHADERS = SHADERS;

})(window);
