(function(global) {

var SHADERS = {
  Start : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'uniform mat4 model;\n' +
      'uniform mat4 view;\n' +
      'uniform mat4 proj;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  n = mat3(model) * normal;\n' +
      '  gl_Position = proj * view * model * vec4(position, 1.0);\n' +
      '  vs = (view * model * vec4(position, 1.0)).xyz;\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  float fog_factor = clamp((320.0 - length(vs)) / 200.0, 0.0, 1.0);\n' +
      '  vec3 out_color;\n' +
      '  out_color.x = 0.1 * (0.5 + n.x / 2.0);\n' +
      '  out_color.y = 0.2 + 0.2 * (0.5 + n.y / 2.0);\n' +
      '  out_color.z = 0.1 + 0.7 * (0.9 + n.z / 2.0);\n' +
      '  gl_FragColor = vec4(out_color * 1.2 * fog_factor, 1.0);\n' +
      '}\n',
  },
  Red : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'uniform mat4 model;\n' +
      'uniform mat4 view;\n' +
      'uniform mat4 proj;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  n = mat3(model) * normal;\n' +
      '  gl_Position = proj * view * model * vec4(position, 1.0);\n' +
      '  vs = (view * model * vec4(position, 1.0)).xyz;\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  float fog_factor = clamp((320.0 - length(vs)) / 200.0, 0.0, 1.0);\n' +
      '  vec3 out_color;\n' +
      '  out_color.x = 0.1 + 0.7 * (0.9 + n.z / 2.0);\n' +
      '  out_color.y = 0.2 + 0.2 * (0.5 + n.y / 2.0);\n' +
      '  out_color.z = 0.1 * (0.5 + n.x / 2.0);\n' +
      //'  out_color.x = 0.2 + 0.3 * (1.5 + (n.x + n.y + n.z) / 2.0);\n' +
      //'  out_color.y = 0.5 * (0.5 + n.y / 2.0);\n' +
      //'  out_color.z = 0.1 * (0.9 + n.z / 2.0);\n' +

      '  gl_FragColor = vec4(out_color * fog_factor, 1.0);\n' +
      '}\n',
  },
  Yellow : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'uniform mat4 model;\n' +
      'uniform mat4 view;\n' +
      'uniform mat4 proj;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  n = mat3(model) * normal;\n' +
      '  gl_Position = proj * view * model * vec4(position, 1.0);\n' +
      '  vs = (view * model * vec4(position, 1.0)).xyz;\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  float fog_factor = clamp((320.0 - length(vs)) / 200.0, 0.0, 1.0);\n' +
      '  vec3 out_color;\n' +
      '  out_color.x = 0.3 + 0.5 * (0.8 + n.z / 2.0);\n' +
      '  out_color.y = 0.4 + 0.25 * (0.8 + n.y / 2.0);\n' +
      '  out_color.z = 0.25 * (0.8 + n.x / 2.0);\n' +
      //'  out_color.x = 0.2 + 0.3 * (1.5 + (n.x + n.y + n.z) / 2.0);\n' +
      //'  out_color.y = 0.5 * (0.5 + n.y / 2.0);\n' +
      //'  out_color.z = 0.1 * (0.9 + n.z / 2.0);\n' +

      '  gl_FragColor = vec4(out_color * 0.9 * fog_factor, 1.0);\n' +
      '}\n',
  },
  Ripple : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'uniform mat4 model;\n' +
      'uniform mat4 view;\n' +
      'uniform mat4 proj;\n' +
      'uniform float st;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  n = mat3(model) * normal;\n' +
      '  gl_Position = proj * view * model * vec4(position + vec3(st * position.xy * 0.1 + -abs(st) * normal.xy * 0.2, 0.0), 1.0);\n' +
      '  vs = (view * model * vec4(position, 1.0)).xyz;\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  float fog_factor = clamp((320.0 - length(vs)) / 200.0, 0.0, 1.0);\n' +
      '  vec3 out_color;\n' +
      '  out_color.y = 0.1 + 0.5 * (0.8 + n.z / 2.0);\n' +
      '  out_color.x = 0.2 + 0.2 * (0.5 + n.y / 2.0);\n' +
      '  out_color.z = 0.1 * (0.5 + n.x / 2.0);\n' +
      '  gl_FragColor = vec4(out_color * fog_factor, 1.0);\n' +
      '}\n',
  },
  SolidColor : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'uniform mat4 model;\n' +
      'uniform mat4 view;\n' +
      'uniform mat4 proj;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +

      'void main(void) {\n' +
      '  n = normal;\n' +
      '  gl_Position = proj * view * model * vec4(position, 1.0);\n' +
      '  vs = (view * model * vec4(position, 1.0)).xyz;\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +
      'varying vec3 vs;\n' +
      'uniform vec3 c;\n' +

      'void main(void) {\n' +
      '  float fog_factor = clamp((320.0 - length(vs)) / 200.0, 0.0, 1.0);\n' +
      '  gl_FragColor = vec4(c * fog_factor, 1.0);\n' +
      '}\n',
  },
  UI : {
    vs:
      'attribute vec3 position;\n' +
      'attribute vec3 normal;\n' +

      'varying vec3 n;\n' +

      'void main(void) {\n' +
      '  n = normal;\n' +
      '  gl_Position = vec4(position / 2.0 + 0.5, 1.0);\n' +
      '}\n',
    fs:
      'precision mediump float;\n' +
      'varying vec3 n;\n' +
      'uniform vec3 c;\n' +

      'void main(void) {\n' +
      '  gl_FragColor = vec4(n, 1.0);\n' +
      '}\n',
  }
};

global.SHADERS = SHADERS;

})(window);
