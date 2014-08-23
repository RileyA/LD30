(function(global) {

// There's few enough of these that I don't feel bad hardcoding them.
// See resources/ply2js.cc for a terrible converter.
var MESHES = {
Cube : {
verts : new Float32Array([
1,-1,-1,0,-1,0,
1,-1,1,0,-1,0,
-1,-1,1,0,-1,0,
1,1,-0.999999,-0,1,0,
-1,1,-1,-0,1,0,
0.999999,1,1,-0,1,0,
1,-1,-1,1,-0,0,
1,1,-0.999999,1,-0,0,
1,-1,1,1,-0,0,
1,-1,1,-0,-0,1,
0.999999,1,1,-0,-0,1,
-1,-1,1,-0,-0,1,
-1,-1,1,-1,-0,-0,
-1,1,1,-1,-0,-0,
-1,1,-1,-1,-0,-0,
1,1,-0.999999,0,0,-1,
1,-1,-1,0,0,-1,
-1,1,-1,0,0,-1,
-1,-1,-1,0,-1,-0,
1,1,-0.999999,1,0,1e-06,
0.999999,1,1,1,0,1e-06,
1,-1,1,1,0,1e-06,
-1,-1,-1,0,0,-1,
-1,1,1,0,1,0,
-1,-1,-1,-1,-0,-0,
-1,1,1,-0,0,1,
]),
indices : new Uint16Array([
0,1,2,
3,4,5,
6,7,8,
9,10,11,
12,13,14,
15,16,17,
18,0,2,
19,20,21,
16,22,17,
4,23,5,
24,12,14,
10,25,11,
]),
}
};

global.MESHES = MESHES;

})(window);
