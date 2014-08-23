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
      '  gl_Position = proj * view * model * vec4(position, 1.0);\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +

      'void main(void) {\n' +
      '  gl_FragColor = vec4(vec3(0.1 * (0.5 + n.x / 2.0), 0.3 * (0.5 + n.y / 2.0), 0.7 * (0.9 + n.z / 2.0)), 1.0);\n' +
      '}\n',
  }
};

global.SHADERS = SHADERS;

})(window);
