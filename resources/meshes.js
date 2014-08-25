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
},

PortalFrame : {
verts : new Float32Array([
1e-06,-3.61881,-0.234,0,0,-1,
-2.84758,1.77583,-0.234,0,0,-1,
0,-2.95445,-0.234,0,0,-1,
3.46745,2.14119,-0.234,0,-0,-1,
2.84758,1.77583,-0.234,0,-0,-1,
1e-06,-3.61881,0.234,0,0,1,
-2.84758,1.77583,0.234,0,0,1,
-3.46745,2.14119,0.234,0,0,1,
3.46745,2.14119,0.234,-0,0,1,
2.84758,1.77583,0.234,-0,0,1,
-2.84758,1.77583,-0.234,0.85674,0.515748,0,
-2.84758,1.77583,0.234,0.85674,0.515748,0,
0,-2.95445,-0.234,0.85674,0.515748,0,
0,-2.95445,-0.234,-0.85674,0.515748,0,
2.84758,1.77583,0.234,-0.85674,0.515748,0,
2.84758,1.77583,-0.234,-0.85674,0.515748,0,
-2.84758,1.77583,-0.234,0,-1,0,
2.84758,1.77583,-0.234,0,-1,0,
2.84758,1.77583,0.234,0,-1,0,
-3.46745,2.14119,0.234,-0.85674,-0.515748,0,
-3.46745,2.14119,-0.234,-0.85674,-0.515748,0,
1e-06,-3.61881,-0.234,-0.85674,-0.515748,0,
3.46745,2.14119,-0.234,0.85674,-0.515748,0,
1e-06,-3.61881,0.234,0.85674,-0.515748,0,
1e-06,-3.61881,-0.234,0.85674,-0.515748,0,
3.46745,2.14119,-0.234,-0,1,0,
-3.46745,2.14119,-0.234,-0,1,0,
-3.46745,2.14119,0.234,-0,1,0,
-3.46745,2.14119,-0.234,-0,-0,-1,
0,-2.95445,0.234,-0,0,1,
0,-2.95445,0.234,-0.85674,0.515748,0,
-2.84758,1.77583,0.234,0,-1,0,
1e-06,-3.61881,0.234,-0.85674,-0.515748,0,
3.46745,2.14119,0.234,0.85674,-0.515748,0,
3.46745,2.14119,0.234,-0,1,0,
0,-2.95445,0.234,0.85674,0.515748,0,
]),
indices : new Uint16Array([
0,1,2,
3,0,4,
3,4,1,
5,6,7,
8,9,5,
8,7,6,
10,11,12,
13,14,15,
16,17,18,
19,20,21,
22,23,24,
25,26,27,
28,1,0,
4,0,2,
28,3,1,
29,6,5,
5,9,29,
9,8,6,
30,14,13,
31,16,18,
32,19,21,
33,23,22,
34,25,27,
12,11,35,
]),
},

Portal : {
verts : new Float32Array([
3.22911,2.00921,0.05081,-0,0,1,
-3.22911,2.00921,0.05081,-0,0,1,
1e-06,-3.35486,0.05081,-0,0,1,
]),
indices : new Uint16Array([
0,1,2,
]),
},



GiantPortal : {
verts : new Float32Array([
33.372,22.505,0.050808,-0,0,1,
-33.372,22.505,0.050808,-0,0,1,
7e-06,-32.9313,0.050813,-0,0,1,
]),
indices : new Uint16Array([
0,1,2,
]),
},


Powerup : {
verts : new Float32Array([
-0.0441,0.63,-0.1323,0,0.440015,-0.89799,
-0.1323,0.63,-0.1323,0,0.440015,-0.89799,
0,0.9,-0,0,0.440015,-0.89799,
0.0441,-0.63,-0.1323,-0,-0.440015,-0.89799,
0.1323,-0.63,-0.1323,-0,-0.440015,-0.89799,
0,-0.9,-0,-0,-0.440015,-0.89799,
0.0441,0.63,0.1323,0,0.440015,0.89799,
0.1323,0.63,0.1323,0,0.440015,0.89799,
0,0.9,-0,0,0.440015,0.89799,
-0.1323,0.63,0.0441,-0.89799,0.440015,0,
-0.1323,0.63,0.1323,-0.89799,0.440015,0,
0,0.9,-0,-0.89799,0.440015,0,
0.1323,0.63,-0.0441,0.89799,0.440015,-0,
0.1323,0.63,-0.1323,0.89799,0.440015,-0,
0,0.9,-0,0.89799,0.440015,-0,
-0.0441,-0.63,0.1323,0,-0.440015,0.89799,
-0.1323,-0.63,0.1323,0,-0.440015,0.89799,
0,-0.9,-0,0,-0.440015,0.89799,
-0.1323,-0.63,-0.0441,-0.89799,-0.440015,0,
-0.1323,-0.63,-0.1323,-0.89799,-0.440015,0,
0,-0.9,-0,-0.89799,-0.440015,0,
0.1323,-0.63,0.0441,0.89799,-0.440015,0,
0.1323,-0.63,0.1323,0.89799,-0.440015,0,
0,-0.9,-0,0.89799,-0.440015,0,
-0.311374,-0,-0.441,0,0.440015,-0.89799,
-0.441,-0,-0.441,0,0.440015,-0.89799,
0.311374,-0,0.441,-0,0.440015,0.89799,
0.441,-0,0.441,-0,0.440015,0.89799,
-0.441,-0,0.307012,-0.89799,0.440015,0,
-0.441,-0,0.441,-0.89799,0.440015,0,
0.441,-0,-0.309734,0.89799,0.440015,0,
0.441,-0,-0.441,0.89799,0.440015,0,
0.311374,-0,-0.441,-0,-0.440015,-0.89799,
0.441,-0,-0.441,-0,-0.440015,-0.89799,
-0.311374,-0,0.441,0,-0.440015,0.89799,
-0.441,-0,0.441,0,-0.440015,0.89799,
-0.441,-0,-0.309734,-0.89799,-0.440015,-0,
-0.441,-0,-0.441,-0.89799,-0.440015,-0,
0.441,-0,0.312248,0.89799,-0.440015,-0,
0.441,-0,0.441,0.89799,-0.440015,-0,
-0.1323,0.63,0.1323,0,0.440015,0.89799,
-0.0441,0.63,0.1323,0,0.440015,0.89799,
0,0.9,-0,0,0.440015,0.89799,
0.1323,-0.63,0.1323,0,-0.440015,0.89799,
0.0441,-0.63,0.1323,0,-0.440015,0.89799,
0,-0.9,-0,0,-0.440015,0.89799,
0,-0.9,-0,0,-0.440015,0.89799,
-0.441,-0,0.441,-0,0.440015,0.89799,
-0.311374,-0,0.441,-0,0.440015,0.89799,
0.441,-0,0.441,0,-0.440015,0.89799,
0.311374,-0,0.441,0,-0.440015,0.89799,
-0.1323,0.63,-0.1323,-0.89799,0.440015,0,
-0.1323,0.63,-0.0441,-0.89799,0.440015,0,
0,0.9,-0,-0.89799,0.440015,0,
0,0.9,-0,-0.89799,0.440015,0,
-0.1323,-0.63,0.1323,-0.89799,-0.440015,0,
-0.1323,-0.63,0.0441,-0.89799,-0.440015,0,
0,-0.9,-0,-0.89799,-0.440015,0,
0,-0.9,-0,-0.89799,-0.440015,-0,
-0.441,-0,-0.441,-0.89799,0.440015,0,
-0.441,-0,-0.309734,-0.89799,0.440015,0,
-0.441,-0,0.441,-0.89799,-0.440015,-0,
-0.441,-0,0.307012,-0.89799,-0.440015,-0,
0.1323,0.63,-0.1323,0,0.440015,-0.89799,
0.0441,0.63,-0.1323,0,0.440015,-0.89799,
0,0.9,-0,0,0.440015,-0.89799,
-0.1323,-0.63,-0.1323,-0,-0.440015,-0.89799,
-0.0441,-0.63,-0.1323,-0,-0.440015,-0.89799,
0,-0.9,-0,-0,-0.440015,-0.89799,
0.441,-0,-0.441,0,0.440015,-0.89799,
0.311374,-0,-0.441,0,0.440015,-0.89799,
-0.441,-0,-0.441,-0,-0.440015,-0.89799,
-0.311374,-0,-0.441,-0,-0.440015,-0.89799,
0.1323,0.63,0.1323,0.89799,0.440015,-0,
0.1323,0.63,0.0441,0.89799,0.440015,-0,
0,0.9,-0,0.89799,0.440015,-0,
0,0.9,-0,0.89799,0.440015,-0,
0.1323,-0.63,-0.1323,0.89799,-0.440015,-0,
0.1323,-0.63,-0.0441,0.89799,-0.440015,-0,
0,-0.9,-0,0.89799,-0.440015,-0,
0,-0.9,-0,0.89799,-0.440015,0,
0.441,-0,0.441,0.89799,0.440015,0,
0.441,-0,0.312248,0.89799,0.440015,0,
0.441,-0,-0.441,0.89799,-0.440015,-0,
0.441,-0,-0.309734,0.89799,-0.440015,-0,
-0.311374,-0,0.309837,0.919601,-0.392744,-0.009258,
-0.045037,0.63,0.039236,0.919601,-0.392744,-0.009258,
-0.0441,0.63,0.1323,0.919601,-0.392744,-0.009258,
0.045037,0.63,0.039236,-0.919601,-0.392744,-0.009258,
0.311374,-0,0.309837,-0.919601,-0.392744,-0.009258,
0.0441,0.63,0.1323,-0.919601,-0.392744,-0.009258,
0.0441,0.63,0.1323,0,-1,0,
-0.0441,0.63,0.1323,0,-1,0,
-0.045037,0.63,0.039236,0,-1,0,
-0.441,-0,0.307012,0.020029,-0.393396,-0.919151,
-0.1323,0.63,0.0441,0.020029,-0.393396,-0.919151,
-0.311374,-0,0.309837,0.020029,-0.393396,-0.919151,
-0.1323,0.63,0.0441,-0,-1,0,
-0.1323,0.63,-0.0441,-0,-1,0,
-0.045037,0.63,-0.039236,0,-1,0,
0.045037,0.63,-0.039236,0,-1,0,
-0.0441,0.63,-0.1323,-0,-1,0,
0.0441,0.63,-0.1323,-0,-1,0,
-0.1323,0.63,-0.0441,0,-0.388517,0.921441,
-0.441,-0,-0.309734,0,-0.388517,0.921441,
-0.311374,-0,-0.309734,0,-0.388517,0.921441,
-0.441,-0,-0.309734,-0,0.388517,0.921441,
-0.1323,-0.63,-0.0441,-0,0.388517,0.921441,
-0.311374,-0,-0.309734,-0,0.388517,0.921441,
-0.311374,-0,-0.441,0.920581,0.390551,0,
-0.311374,-0,-0.309734,0.920581,0.390551,0,
-0.0441,-0.63,-0.1323,0.920581,0.390551,0,
-0.0441,0.63,-0.1323,0.919602,-0.392743,0.009258,
-0.045037,0.63,-0.039236,0.919602,-0.392743,0.009258,
-0.311374,-0,-0.309734,0.919602,-0.392743,0.009258,
0.0441,0.63,-0.1323,-0.920581,-0.390551,-0,
0.311374,-0,-0.441,-0.920581,-0.390551,-0,
0.311374,-0,-0.309734,-0.920581,-0.390551,-0,
0.311374,-0,-0.441,-0.920581,0.390551,0,
0.0441,-0.63,-0.1323,-0.920581,0.390551,0,
0.311374,-0,-0.309734,-0.920581,0.390551,0,
0.441,-0,-0.309734,-0,0.388517,0.921441,
0.311374,-0,-0.309734,-0,0.388517,0.921441,
0.1323,-0.63,-0.0441,-0,0.388517,0.921441,
0.1323,0.63,-0.0441,0.051581,-0.375516,0.925379,
0.045037,0.63,-0.039236,0.051581,-0.375516,0.925379,
0.311374,-0,-0.309734,0.051581,-0.375516,0.925379,
0.1323,0.63,0.0441,0,-1,0,
0.045037,0.63,0.039236,0,-1,0,
0.441,-0,0.312248,0.017168,-0.384442,-0.92299,
0.311374,-0,0.309837,0.017168,-0.384442,-0.92299,
0.1323,0.63,0.0441,0.017168,-0.384442,-0.92299,
0.441,-0,0.312248,0.017168,0.384442,-0.92299,
0.1323,-0.63,0.0441,0.017168,0.384442,-0.92299,
0.311374,-0,0.309837,0.017168,0.384442,-0.92299,
0.311374,-0,0.441,-0.920581,0.390551,0,
0.311374,-0,0.309837,-0.920581,0.390551,0,
0.0441,-0.63,0.1323,-0.920581,0.390551,0,
0.0441,-0.63,0.1323,0,1,-0,
0.045037,-0.63,0.039236,0,1,-0,
-0.045037,-0.63,0.039236,0,1,-0,
-0.0441,-0.63,0.1323,0.919601,0.392744,-0.009258,
-0.045037,-0.63,0.039236,0.919601,0.392744,-0.009258,
-0.311374,-0,0.309837,0.919601,0.392744,-0.009258,
-0.1323,-0.63,0.0441,0.020029,0.393396,-0.919151,
-0.441,-0,0.307012,0.020029,0.393396,-0.919151,
-0.311374,-0,0.309837,0.020029,0.393396,-0.919151,
-0.1323,-0.63,0.0441,0,1,1e-06,
-0.045037,-0.63,0.039236,0,1,1e-06,
-0.1323,-0.63,-0.0441,0,1,1e-06,
0.045037,-0.63,0.039236,0,1,1e-06,
0.045037,-0.63,-0.039236,0,1,1e-06,
0.1323,-0.63,0.0441,1e-06,1,0,
0.1323,-0.63,-0.0441,1e-06,1,0,
0.045037,-0.63,-0.039236,1e-06,1,0,
-0.0441,-0.63,-0.1323,0,1,0,
-0.045037,-0.63,-0.039236,0,1,0,
0.0441,-0.63,-0.1323,0,1,0,
0,0.9,-0,-0,0.440015,0.89799,
0,-0.9,-0,0,-0.440015,0.89799,
0,0.9,-0,0.83205,-0.5547,0,
-0.1323,0.63,0.0441,0.83205,-0.5547,0,
0,0.9,-0,0.83205,-0.5547,0,
0,0.9,-0,-0.83205,-0.5547,0,
0.1323,0.63,-0.0441,-0.83205,-0.5547,0,
0,0.9,-0,-0.83205,-0.5547,0,
0,-0.9,-0,0.83205,0.5547,0,
-0.1323,-0.63,-0.0441,0.83205,0.5547,0,
0,-0.9,-0,0.83205,0.5547,0,
0,-0.9,-0,-0.894427,0.447214,0,
0.1323,-0.63,0.0441,-0.894427,0.447214,0,
0,-0.9,-0,-0.894427,0.447214,0,
0,0.9,-0,-0,0.440015,0.89799,
0,0.9,-0,0,0.447214,0.894427,
-0.0441,0.63,0.1323,0,0.447214,0.894427,
0,0.9,-0,0,0.447214,0.894427,
0,-0.9,-0,0,-0.440015,-0.89799,
-0.1323,0.63,-0.0441,0.89799,-0.440015,0,
0,0.9,-0,0.89799,-0.440015,0,
0,0.9,-0,0.89799,-0.440015,0,
0,0.9,-0,0.894427,-0.447214,0,
-0.1323,0.63,-0.0441,0.894427,-0.447214,0,
0,0.9,-0,0.894427,-0.447214,0,
-0.1323,-0.63,0.0441,0.89799,0.440015,-0,
0,-0.9,-0,0.89799,0.440015,-0,
0,-0.9,-0,0.89799,0.440015,-0,
0,-0.9,-0,0.894427,0.447214,0,
-0.1323,-0.63,0.0441,0.894427,0.447214,0,
0,-0.9,-0,0.894427,0.447214,0,
0,0.9,-0,0,0.440015,-0.89799,
0,0.9,-0,0,0.447214,-0.894427,
0.0441,0.63,-0.1323,0,0.447214,-0.894427,
0,0.9,-0,0,0.447214,-0.894427,
0,-0.9,-0,0,-0.440015,-0.89799,
0,-0.9,-0,0,-0.447214,-0.894427,
-0.0441,-0.63,-0.1323,0,-0.447214,-0.894427,
0,-0.9,-0,0,-0.447214,-0.894427,
0.1323,0.63,0.0441,-0.89799,-0.440015,0,
0,0.9,-0,-0.89799,-0.440015,0,
0,0.9,-0,-0.89799,-0.440015,0,
0,0.9,-0,-0.894427,-0.447214,0,
0.1323,0.63,0.0441,-0.894427,-0.447214,0,
0,0.9,-0,-0.894427,-0.447214,0,
0.1323,-0.63,-0.0441,-0.89799,0.440015,0,
0,-0.9,-0,-0.89799,0.440015,0,
0,-0.9,-0,-0.89799,0.440015,0,
0,-0.9,-0,-0.894427,0.447214,0,
0.1323,-0.63,-0.0441,-0.894427,0.447214,0,
-0.311374,-0,0.441,0.920581,-0.390551,0,
-0.311374,-0,0.309837,0.920581,-0.390551,0,
-0.0441,0.63,0.1323,0.920581,-0.390551,0,
0.311374,-0,0.309837,-0.920581,-0.390551,-0,
0.311374,-0,0.441,-0.920581,-0.390551,-0,
0.0441,0.63,0.1323,-0.920581,-0.390551,-0,
-0.1323,0.63,0.0441,-0.051578,-0.375647,-0.925327,
-0.045037,0.63,0.039236,-0.051578,-0.375647,-0.925327,
-0.311374,-0,0.309837,-0.051578,-0.375647,-0.925327,
-0.045037,-0.63,-0.039236,-0,1,1e-06,
-0.045037,0.63,-0.039236,-0.051581,-0.375516,0.925379,
-0.1323,0.63,-0.0441,-0.051581,-0.375516,0.925379,
-0.311374,-0,-0.309734,-0.051581,-0.375516,0.925379,
-0.1323,-0.63,-0.0441,-0.051581,0.375516,0.925379,
-0.045037,-0.63,-0.039236,-0.051581,0.375516,0.925379,
-0.311374,-0,-0.309734,-0.051581,0.375516,0.925379,
-0.311374,-0,-0.309734,0.919602,0.392743,0.009258,
-0.045037,-0.63,-0.039236,0.919602,0.392743,0.009258,
-0.0441,-0.63,-0.1323,0.919602,0.392743,0.009258,
-0.311374,-0,-0.441,0.920581,-0.390551,0,
-0.0441,0.63,-0.1323,0.920581,-0.390551,0,
-0.311374,-0,-0.309734,0.920581,-0.390551,0,
0.045037,0.63,-0.039236,-0.919602,-0.392743,0.009258,
0.0441,0.63,-0.1323,-0.919602,-0.392743,0.009258,
0.311374,-0,-0.309734,-0.919602,-0.392743,0.009258,
0.0441,-0.63,-0.1323,-0.919602,0.392743,0.009258,
0.045037,-0.63,-0.039236,-0.919602,0.392743,0.009258,
0.311374,-0,-0.309734,-0.919602,0.392743,0.009258,
0.311374,-0,-0.309734,0.051581,0.375516,0.925379,
0.045037,-0.63,-0.039236,0.051581,0.375516,0.925379,
0.1323,-0.63,-0.0441,0.051581,0.375516,0.925379,
0.441,-0,-0.309734,0,-0.388517,0.921441,
0.1323,0.63,-0.0441,0,-0.388517,0.921441,
0.311374,-0,-0.309734,0,-0.388517,0.921441,
0.1323,0.63,-0.0441,0,-1,0,
0.311374,-0,0.309837,0.051578,-0.375647,-0.925327,
0.045037,0.63,0.039236,0.051578,-0.375647,-0.925327,
0.1323,0.63,0.0441,0.051578,-0.375647,-0.925327,
0.1323,-0.63,0.0441,0.051578,0.375647,-0.925327,
0.045037,-0.63,0.039236,0.051578,0.375647,-0.925327,
0.311374,-0,0.309837,0.051578,0.375647,-0.925327,
0.311374,-0,0.309837,-0.919601,0.392744,-0.009258,
0.045037,-0.63,0.039236,-0.919601,0.392744,-0.009258,
0.0441,-0.63,0.1323,-0.919601,0.392744,-0.009258,
-0.0441,-0.63,0.1323,0,1,-0,
-0.311374,-0,0.441,0.920581,0.390551,0,
-0.0441,-0.63,0.1323,0.920581,0.390551,0,
-0.311374,-0,0.309837,0.920581,0.390551,0,
-0.045037,-0.63,0.039236,-0.051578,0.375647,-0.925327,
-0.1323,-0.63,0.0441,-0.051578,0.375647,-0.925327,
-0.311374,-0,0.309837,-0.051578,0.375647,-0.925327,
0.1323,-0.63,0.0441,-0,1,1e-06,
0,0.9,-0,0,0.440015,-0.89799,
0.045037,-0.63,-0.039236,0,1,-0,
]),
indices : new Uint16Array([
0,1,2,
3,4,5,
6,7,8,
9,10,11,
12,13,14,
15,16,17,
18,19,20,
21,22,23,
24,25,1,
26,27,7,
28,29,10,
30,31,13,
32,33,4,
34,35,16,
36,37,19,
38,39,22,
40,41,42,
41,6,8,
43,44,45,
44,15,46,
47,48,40,
49,50,43,
51,52,53,
52,9,54,
55,56,57,
56,18,58,
59,60,51,
61,62,55,
63,64,65,
64,0,2,
66,67,68,
67,3,5,
69,70,63,
71,72,66,
73,74,75,
74,12,76,
77,78,79,
78,21,80,
81,82,73,
83,84,77,
85,86,87,
88,89,90,
91,92,93,
94,95,96,
97,98,93,
93,99,100,
101,102,100,
103,104,105,
106,107,108,
109,110,111,
112,113,114,
115,116,117,
118,119,120,
121,122,123,
124,125,126,
127,128,100,
129,130,131,
132,133,134,
135,136,137,
138,139,140,
141,142,143,
144,145,146,
147,148,149,
148,150,151,
152,153,154,
155,156,157,
15,17,46,
7,158,8,
16,159,17,
160,161,162,
163,164,165,
98,99,93,
166,167,168,
169,170,171,
0,24,1,
6,26,7,
9,28,10,
12,30,13,
3,32,4,
15,34,16,
18,36,19,
21,38,22,
41,172,42,
173,174,175,
44,46,45,
4,176,5,
48,41,40,
50,44,43,
177,178,179,
180,181,182,
183,184,185,
186,187,188,
60,52,51,
62,56,55,
64,189,65,
190,191,192,
67,193,68,
194,195,196,
70,64,63,
72,67,66,
197,198,199,
200,201,202,
203,204,205,
206,207,169,
82,74,73,
84,78,77,
208,209,210,
211,212,213,
128,91,93,
214,215,216,
148,217,149,
128,93,100,
99,101,100,
218,219,220,
221,222,223,
224,225,226,
227,228,229,
230,231,232,
233,234,235,
236,237,238,
239,240,241,
242,127,100,
243,244,245,
246,247,248,
249,250,251,
252,138,140,
253,254,255,
256,257,258,
217,148,151,
150,259,151,
1,260,2,
156,261,157,
]),
},


Pickup : {
verts : new Float32Array([
0,-0.7,-0,0.187597,-0.794651,0.577354,
0.50652,-0.31305,0.368004,0.187597,-0.794651,0.577354,
-0.19347,-0.31305,0.595448,0.187597,-0.794651,0.577354,
0.50652,-0.31305,0.368004,0.607065,-0.794652,0,
0,-0.7,-0,0.607065,-0.794652,0,
0.50652,-0.31305,-0.368004,0.607065,-0.794652,0,
0,-0.7,-0,-0.491122,-0.794652,0.356829,
-0.19347,-0.31305,0.595448,-0.491122,-0.794652,0.356829,
-0.626098,-0.31305,-0,-0.491122,-0.794652,0.356829,
0,-0.7,-0,-0.491122,-0.794652,-0.356829,
-0.626098,-0.31305,-0,-0.491122,-0.794652,-0.356829,
-0.19347,-0.31305,-0.595448,-0.491122,-0.794652,-0.356829,
0,-0.7,-0,0.187597,-0.794651,-0.577354,
-0.19347,-0.31305,-0.595448,0.187597,-0.794651,-0.577354,
0.50652,-0.31305,-0.368004,0.187597,-0.794651,-0.577354,
0.50652,-0.31305,0.368004,0.982246,-0.187597,0,
0.50652,-0.31305,-0.368004,0.982246,-0.187597,0,
0.626098,0.31305,-0,0.982246,-0.187597,0,
-0.19347,-0.31305,0.595448,0.303536,-0.187589,0.934172,
0.50652,-0.31305,0.368004,0.303536,-0.187589,0.934172,
0.19347,0.31305,0.595448,0.303536,-0.187589,0.934172,
-0.626098,-0.31305,-0,-0.794649,-0.187587,0.577359,
-0.19347,-0.31305,0.595448,-0.794649,-0.187587,0.577359,
-0.50652,0.31305,0.368004,-0.794649,-0.187587,0.577359,
-0.19347,-0.31305,-0.595448,-0.794649,-0.187587,-0.577359,
-0.626098,-0.31305,-0,-0.794649,-0.187587,-0.577359,
-0.50652,0.31305,-0.368004,-0.794649,-0.187587,-0.577359,
0.50652,-0.31305,-0.368004,0.303536,-0.187589,-0.934172,
-0.19347,-0.31305,-0.595448,0.303536,-0.187589,-0.934172,
0.19347,0.31305,-0.595448,0.303536,-0.187589,-0.934172,
0.50652,-0.31305,0.368004,0.794649,0.187587,0.577359,
0.626098,0.31305,-0,0.794649,0.187587,0.577359,
0.19347,0.31305,0.595448,0.794649,0.187587,0.577359,
-0.19347,-0.31305,0.595448,-0.303536,0.187589,0.934172,
0.19347,0.31305,0.595448,-0.303536,0.187589,0.934172,
-0.50652,0.31305,0.368004,-0.303536,0.187589,0.934172,
-0.626098,-0.31305,-0,-0.982246,0.187597,0,
-0.50652,0.31305,0.368004,-0.982246,0.187597,0,
-0.50652,0.31305,-0.368004,-0.982246,0.187597,0,
-0.19347,-0.31305,-0.595448,-0.303536,0.187589,-0.934172,
-0.50652,0.31305,-0.368004,-0.303536,0.187589,-0.934172,
0.19347,0.31305,-0.595448,-0.303536,0.187589,-0.934172,
0.50652,-0.31305,-0.368004,0.794649,0.187587,-0.577359,
0.19347,0.31305,-0.595448,0.794649,0.187587,-0.577359,
0.626098,0.31305,-0,0.794649,0.187587,-0.577359,
0.19347,0.31305,0.595448,0.491122,0.794652,0.356829,
0.626098,0.31305,-0,0.491122,0.794652,0.356829,
0,0.7,-0,0.491122,0.794652,0.356829,
-0.50652,0.31305,0.368004,-0.187597,0.794651,0.577354,
0.19347,0.31305,0.595448,-0.187597,0.794651,0.577354,
0,0.7,-0,-0.187597,0.794651,0.577354,
-0.50652,0.31305,-0.368004,-0.607065,0.794652,0,
-0.50652,0.31305,0.368004,-0.607065,0.794652,0,
0,0.7,-0,-0.607065,0.794652,0,
0.19347,0.31305,-0.595448,-0.187597,0.794651,-0.577354,
-0.50652,0.31305,-0.368004,-0.187597,0.794651,-0.577354,
0,0.7,-0,-0.187597,0.794651,-0.577354,
0.626098,0.31305,-0,0.491122,0.794652,-0.356829,
0.19347,0.31305,-0.595448,0.491122,0.794652,-0.356829,
0,0.7,-0,0.491122,0.794652,-0.356829,
]),
indices : new Uint16Array([
0,1,2,
3,4,5,
6,7,8,
9,10,11,
12,13,14,
15,16,17,
18,19,20,
21,22,23,
24,25,26,
27,28,29,
30,31,32,
33,34,35,
36,37,38,
39,40,41,
42,43,44,
45,46,47,
48,49,50,
51,52,53,
54,55,56,
57,58,59,
]),
},


PickupFrame : {
verts : new Float32Array([
-0.752694,0.754836,0.752694,0,1,-0,
0.756919,0.754836,0.752694,0,1,-0,
0.681439,0.754836,0.677213,0,1,-0,
0.756919,0.754836,-0.756919,-0,1,0,
0.681439,0.754836,-0.681439,-0,1,0,
-0.752694,0.754836,-0.756919,-0,1,0,
-0.677213,0.754836,-0.681439,-0,1,0,
-0.677213,0.754836,0.677213,0,1,0,
0.756919,-0.754777,-0.756919,1,0,0,
0.756919,0.754836,-0.756919,1,0,0,
0.756919,-0.679296,-0.681439,1,0,0,
0.756919,0.754836,0.752694,1,-0,0,
0.756919,0.679355,0.677213,1,-0,0,
0.756919,-0.754777,0.752694,1,0,-0,
0.756919,-0.679296,0.677213,1,0,-0,
-0.752694,-0.754777,0.752694,0,0,1,
-0.677213,-0.679296,0.752694,0,0,1,
-0.752694,0.754836,0.752694,0,0,1,
0.756919,-0.754777,0.752694,-0,0,1,
0.756919,0.754836,0.752694,-0,0,1,
0.681439,-0.679296,0.752694,-0,0,1,
-0.677213,0.679355,0.752694,0,-0,1,
-0.752694,-0.754777,0.752694,-1,0,0,
-0.752694,-0.679296,0.677213,-1,0,0,
-0.752694,-0.679296,-0.681439,-1,0,0,
-0.752694,-0.754777,-0.756919,-1,-0,0,
-0.752694,0.754836,-0.756919,-1,-0,0,
-0.752694,0.754836,0.752694,-1,0,0,
-0.752694,0.679355,-0.681439,-1,0,0,
-0.752694,0.679355,0.677213,-1,0,0,
-0.752694,-0.754777,-0.756919,-0,0,-1,
-0.677213,-0.679296,-0.756919,-0,0,-1,
0.681439,-0.679296,-0.756919,-0,0,-1,
0.756919,0.754836,-0.756919,0,0,-1,
0.756919,-0.754777,-0.756919,0,0,-1,
-0.752694,0.754836,-0.756919,0,0,-1,
0.681439,0.679355,-0.756919,0,0,-1,
-0.677213,0.679355,-0.756919,0,0,-1,
-0.752694,-0.754777,0.752694,-0,-1,0,
-0.677213,-0.754777,0.677213,-0,-1,0,
0.756919,-0.754777,0.752694,-0,-1,0,
0.681439,-0.754777,0.677213,0,-1,0,
0.681439,-0.754777,-0.681439,0,-1,0,
0.756919,-0.754777,-0.756919,0,-1,0,
-0.677213,-0.754777,-0.681439,0,-1,0,
-0.752694,-0.754777,-0.756919,0,-1,-0,
-0.677213,-0.754777,0.677213,-0,-0,-1,
-0.677213,-0.678926,0.677213,-0,-0,-1,
0.681439,-0.678926,0.677213,-0,-0,-1,
0.681439,-0.754777,0.677213,-1,0,0,
0.681439,-0.678926,0.677213,-1,0,0,
0.681439,-0.678926,-0.681439,-1,0,0,
0.681439,-0.754777,-0.681439,-0,0,1,
0.681439,-0.678926,-0.681439,-0,0,1,
-0.677213,-0.678926,-0.681439,-0,0,1,
-0.677213,-0.754777,-0.681439,1,0,0,
-0.677213,-0.678926,-0.681439,1,0,0,
-0.677213,-0.678926,0.677213,1,0,0,
-0.677213,0.754836,0.677213,0,0,-1,
0.681439,0.754836,0.677213,0,0,-1,
0.681439,0.67936,0.677213,0,0,-1,
0.681439,0.754836,0.677213,-1,0,0,
0.681439,0.754836,-0.681439,-1,0,0,
0.681439,0.67936,-0.681439,-1,0,0,
0.681439,0.754836,-0.681439,0,0,1,
-0.677213,0.754836,-0.681439,0,0,1,
-0.677213,0.67936,-0.681439,0,0,1,
-0.677213,0.754836,-0.681439,1,-0,0,
-0.677213,0.754836,0.677213,1,-0,0,
-0.677213,0.67936,0.677213,1,-0,0,
-0.752694,0.679355,-0.681439,5.5e-05,-1,0,
-0.677213,0.67936,-0.681439,5.5e-05,-1,0,
-0.677213,0.67936,0.677213,5.5e-05,-1,0,
-0.677213,0.679355,0.752694,-0,-1,-5.5e-05,
-0.677213,0.67936,0.677213,-0,-1,-5.5e-05,
0.681439,0.67936,0.677213,-0,-1,-5.5e-05,
0.756919,0.679355,0.677213,-5.5e-05,-1,0,
0.681439,0.67936,0.677213,-5.5e-05,-1,0,
0.681439,0.67936,-0.681439,-5.5e-05,-1,0,
0.681439,0.679355,-0.756919,0,-1,5.5e-05,
0.681439,0.67936,-0.681439,0,-1,5.5e-05,
-0.677213,0.67936,-0.681439,0,-1,5.5e-05,
-0.752694,0.679355,-0.681439,0,-0,1,
-0.752694,-0.679296,-0.681439,0,-0,1,
-0.677213,0.679355,-0.756919,1,-0,0,
-0.677213,0.67936,-0.681439,1,-0,0,
-0.677213,-0.679296,-0.756919,0,0.999988,-0.004905,
-0.677213,-0.678926,-0.681439,0,0.999988,-0.004905,
0.681439,-0.678926,-0.681439,0,0.999988,-0.004905,
0.681439,-0.679296,-0.756919,-1,-0,0,
0.681439,0.679355,-0.756919,-1,-0,0,
0.756919,-0.679296,-0.681439,-0,0,1,
0.756919,0.679355,-0.681439,-0,0,1,
0.756919,-0.679296,-0.681439,0.004905,0.999988,0,
0.681439,-0.678926,-0.681439,0.004905,0.999988,0,
0.681439,-0.678926,0.677213,0.004905,0.999988,0,
0.756919,-0.679296,0.677213,0,-0,-1,
0.756919,0.679355,0.677213,0,-0,-1,
0.681439,-0.679296,0.752694,-1,0,0,
0.681439,0.679355,0.752694,-1,0,0,
0.681439,-0.679296,0.752694,-0,0.999988,0.004905,
0.681439,-0.678926,0.677213,-0,0.999988,0.004905,
-0.677213,-0.678926,0.677213,-0,0.999988,0.004905,
-0.752694,-0.679296,0.677213,-0.004905,0.999988,0,
-0.677213,-0.678926,0.677213,-0.004905,0.999988,0,
-0.677213,-0.678926,-0.681439,-0.004905,0.999988,0,
0.756919,0.679355,-0.681439,1,0,0,
0.681439,0.679355,0.752694,-0,0,1,
0.681439,-0.754777,0.677213,0,-0,-1,
0.681439,-0.754777,-0.681439,-1,-0,-0,
-0.677213,-0.754777,-0.681439,0,0,1,
-0.677213,-0.754777,0.677213,1,0,-0,
-0.677213,0.67936,0.677213,-0,-0,-1,
0.681439,0.67936,0.677213,-1,0,0,
0.681439,0.67936,-0.681439,-0,0,1,
-0.752694,0.679355,0.677213,5.5e-05,-1,0,
0.681439,0.679355,0.752694,0,-1,-5.5e-05,
0.756919,0.679355,-0.681439,-5.5e-05,-1,-0,
-0.677213,0.679355,-0.756919,0,-1,5.5e-05,
-0.677213,-0.679296,-0.756919,1,0,0,
0.681439,-0.679296,-0.756919,0,0.999988,-0.004905,
0.756919,-0.679296,0.677213,0.004905,0.999988,-0,
-0.677213,-0.679296,0.752694,0,0.999988,0.004905,
-0.752694,-0.679296,-0.681439,-0.004905,0.999988,0,
-0.752694,-0.679296,0.677213,-0,0,-1,
-0.752694,0.679355,0.677213,-0,0,-1,
-0.677213,-0.679296,0.752694,1,0,0,
-0.677213,0.679355,0.752694,1,0,0,
]),
indices : new Uint16Array([
0,1,2,
1,3,4,
3,5,6,
5,0,7,
8,9,10,
9,11,12,
11,13,14,
8,10,14,
15,16,17,
18,19,20,
19,17,21,
18,20,16,
22,23,24,
25,24,26,
27,26,28,
27,29,23,
30,31,32,
33,34,32,
35,33,36,
35,37,31,
38,39,40,
40,41,42,
43,42,44,
45,44,39,
46,47,48,
49,50,51,
52,53,54,
55,56,57,
58,59,60,
61,62,63,
64,65,66,
67,68,69,
70,71,72,
73,74,75,
76,77,78,
79,80,81,
82,83,54,
84,85,56,
86,87,88,
89,51,90,
91,92,53,
93,94,95,
96,48,97,
98,99,50,
100,101,102,
103,104,105,
7,0,2,
2,1,4,
4,3,6,
6,5,7,
16,21,17,
106,9,12,
12,11,14,
13,8,14,
24,28,26,
9,106,10,
107,19,21,
15,18,16,
25,22,24,
29,27,28,
22,27,23,
34,30,32,
36,33,32,
37,35,36,
30,35,31,
19,107,20,
43,40,42,
45,43,44,
38,45,39,
108,46,48,
109,49,51,
110,52,54,
111,55,57,
112,58,60,
113,61,63,
114,64,66,
85,67,69,
115,70,72,
116,73,75,
117,76,78,
118,79,81,
66,82,54,
119,84,56,
120,86,88,
51,63,90,
92,114,53,
121,93,95,
48,60,97,
99,113,50,
122,100,102,
123,103,105,
124,125,112,
126,57,69,
]),
},


Obstacle : {
verts : new Float32Array([
0,-12.7008,0.9,-0.850958,-0.054919,0.522355,
-1.08967,-12.7008,-0.875161,-0.850958,-0.054919,0.522355,
-0.9,-15.876,-0.9,-0.850958,-0.054919,0.522355,
-1.08967,-12.7008,-0.875161,-0.013497,0.049437,-0.998686,
0.748273,-12.7008,-0.9,-0.013497,0.049437,-0.998686,
0.9,-15.876,-1.05923,-0.013497,0.049437,-0.998686,
0.059652,6.3504,0.9,-0.905027,0.017003,0.425014,
-0.785653,6.3504,-0.9,-0.905027,0.017003,0.425014,
0,3.1752,0.9,-0.905027,0.017003,0.425014,
0,-12.7008,0.9,0.923391,-0,0.38386,
0,-15.876,0.9,0.923391,-0,0.38386,
0.748273,-12.7008,-0.9,0.923391,-0,0.38386,
-0.059652,15.876,0.9,-0,1,-0,
0.9,15.876,-1.03269,-0,1,-0,
-0.9,15.876,-0.9,-0,1,-0,
0,9.5256,0.9,-0.870064,-0.016346,0.492667,
-1.10375,9.5256,-1.04925,-0.870064,-0.016346,0.492667,
0.059652,6.3504,0.9,-0.870064,-0.016346,0.492667,
0.09942,12.7008,0.9,-0.896051,0.028057,0.443063,
-0.790611,12.7008,-0.9,-0.896051,0.028057,0.443063,
0,9.5256,0.9,-0.896051,0.028057,0.443063,
-0.059652,15.876,0.9,-0.905675,-0.031201,0.422823,
-0.9,15.876,-0.9,-0.905675,-0.031201,0.422823,
-0.790611,12.7008,-0.9,-0.905675,-0.031201,0.422823,
0,-15.876,0.9,0,-1,0,
-0.9,-15.876,-0.9,0,-1,0,
0.9,-15.876,-1.05923,0,-1,0,
0,3.1752,0.9,-0.871871,-0.028661,0.488895,
-1.00934,3.1752,-0.9,-0.871871,-0.028661,0.488895,
0.104379,1e-06,0.9,-0.871871,-0.028661,0.488895,
0.104379,1e-06,0.9,-0.872894,0.028695,0.487065,
-0.9,-1e-06,-0.9,-0.872894,0.028695,0.487065,
0,-3.1752,0.9,-0.872894,0.028695,0.487065,
0,-3.1752,0.9,-0.855458,0,0.517872,
-1.08967,-3.1752,-0.9,-0.855458,0,0.517872,
0,-6.3504,0.9,-0.855458,0,0.517872,
0,-6.3504,0.9,-0.857809,-0.061479,0.510278,
-1.07075,-6.3504,-0.9,-0.857809,-0.061479,0.510278,
-0.843188,-9.5256,-0.9,-0.857809,-0.061479,0.510278,
0,-9.5256,0.9,-0.905568,0,0.424202,
-0.843188,-9.5256,-0.9,-0.905568,0,0.424202,
0,-12.7008,0.9,-0.905568,0,0.424202,
-0.9,15.876,-0.9,-0.073454,-0.041641,-0.996429,
0.9,15.876,-1.03269,-0.073454,-0.041641,-0.996429,
0.9,12.7008,-0.9,-0.073454,-0.041641,-0.996429,
-0.790611,12.7008,-0.9,0,0,-1,
0.9,12.7008,-0.9,0,0,-1,
0.9,9.5256,-0.9,0,0,-1,
-1.10375,9.5256,-1.04925,0.07428,0,-0.997237,
0.9,9.5256,-0.9,0.07428,0,-0.997237,
0.9,6.3504,-0.9,0.07428,0,-0.997237,
-0.785653,6.3504,-0.9,0,0.063592,-0.997976,
0.9,6.3504,-0.9,0,0.063592,-0.997976,
0.994862,3.1752,-1.10233,0,0.063592,-0.997976,
-1.00934,3.1752,-0.9,-0.100251,-0.061482,-0.993061,
0.994862,3.1752,-1.10233,-0.100251,-0.061482,-0.993061,
0.937945,-1e-06,-0.9,-0.100251,-0.061482,-0.993061,
-0.9,-1e-06,-0.9,0,0,-1,
0.937945,-1e-06,-0.9,0,0,-1,
1.03276,-3.1752,-0.9,0,0,-1,
-1.08967,-3.1752,-0.9,0,0.083289,-0.996525,
1.03276,-3.1752,-0.9,0,0.083289,-0.996525,
0.748273,-6.3504,-1.16538,0,0.083289,-0.996525,
-1.07075,-6.3504,-0.9,-0.143788,-0.089245,-0.985576,
0.748273,-6.3504,-1.16538,-0.143788,-0.089245,-0.985576,
0.9,-9.5256,-0.9,-0.143788,-0.089245,-0.985576,
-0.843188,-9.5256,-0.9,0,0,-1,
0.9,-9.5256,-0.9,0,0,-1,
0.748273,-12.7008,-0.9,0,0,-1,
0.9,15.876,-1.03269,0.89551,0.018582,0.444654,
-0.059652,15.876,0.9,0.89551,0.018582,0.444654,
0.9,12.7008,-0.9,0.89551,0.018582,0.444654,
0.9,12.7008,-0.9,0.913329,-0.028598,0.406218,
0.09942,12.7008,0.9,0.913329,-0.028598,0.406218,
0,9.5256,0.9,0.913329,-0.028598,0.406218,
0.9,9.5256,-0.9,0.894301,0.016801,0.447151,
0,9.5256,0.9,0.894301,0.016801,0.447151,
0.059652,6.3504,0.9,0.894301,0.016801,0.447151,
0.9,6.3504,-0.9,0.905985,-0.017021,0.422968,
0.059652,6.3504,0.9,0.905985,-0.017021,0.422968,
0,3.1752,0.9,0.905985,-0.017021,0.422968,
0.994862,3.1752,-1.10233,0.895164,0.029427,0.444765,
0,3.1752,0.9,0.895164,0.029427,0.444765,
0.104379,1e-06,0.9,0.895164,0.029427,0.444765,
0.937945,-1e-06,-0.9,0.907019,-0.029816,0.420033,
0.104379,1e-06,0.9,0.907019,-0.029816,0.420033,
0,-3.1752,0.9,0.907019,-0.029816,0.420033,
1.03276,-3.1752,-0.9,0.867373,-0,0.497658,
0,-3.1752,0.9,0.867373,-0,0.497658,
0,-6.3504,0.9,0.867373,-0,0.497658,
0.748273,-6.3504,-1.16538,0.940198,-0,0.340627,
0,-6.3504,0.9,0.940198,-0,0.340627,
0,-9.5256,0.9,0.940198,-0,0.340627,
0.9,-9.5256,-0.9,0.894427,-0,0.447214,
0,-9.5256,0.9,0.894427,-0,0.447214,
0,-12.7008,0.9,0.894427,-0,0.447214,
0,-15.876,0.9,-0.894427,0,0.447214,
0,-12.7008,0.9,-0.894427,0,0.447214,
-0.9,-15.876,-0.9,-0.894427,0,0.447214,
-0.9,-15.876,-0.9,-0.088116,0.002529,-0.996107,
-1.08967,-12.7008,-0.875161,-0.088116,0.002529,-0.996107,
0.9,-15.876,-1.05923,-0.088116,0.002529,-0.996107,
-0.785653,6.3504,-0.9,-0.870588,0.06133,0.488176,
-1.00934,3.1752,-0.9,-0.870588,0.06133,0.488176,
0,3.1752,0.9,-0.870588,0.06133,0.488176,
0.748273,-12.7008,-0.9,0.90848,0.022484,0.417323,
0,-15.876,0.9,0.90848,0.022484,0.417323,
0.9,-15.876,-1.05923,0.90848,0.022484,0.417323,
-0.790611,12.7008,-0.9,-0.868478,0.062533,0.491768,
-1.10375,9.5256,-1.04925,-0.868478,0.062533,0.491768,
0,9.5256,0.9,-0.868478,0.062533,0.491768,
-0.843188,-9.5256,-0.9,-0.850149,0.070078,0.521859,
-1.08967,-12.7008,-0.875161,-0.850149,0.070078,0.521859,
0,-12.7008,0.9,-0.850149,0.070078,0.521859,
0.09942,12.7008,0.9,-0.895501,-0.044863,0.442792,
-0.059652,15.876,0.9,-0.895501,-0.044863,0.442792,
-0.790611,12.7008,-0.9,-0.895501,-0.044863,0.442792,
-1.00934,3.1752,-0.9,-0.872859,-0.030057,0.487045,
-0.9,-1e-06,-0.9,-0.872859,-0.030057,0.487045,
0.104379,1e-06,0.9,-0.872859,-0.030057,0.487045,
-0.9,-1e-06,-0.9,-0.854344,0.051035,0.517197,
-1.08967,-3.1752,-0.9,-0.854344,0.051035,0.517197,
0,-3.1752,0.9,-0.854344,0.051035,0.517197,
-1.08967,-3.1752,-0.9,-0.859424,-0.005121,0.511239,
-1.07075,-6.3504,-0.9,-0.859424,-0.005121,0.511239,
0,-6.3504,0.9,-0.859424,-0.005121,0.511239,
0,-6.3504,0.9,-0.905568,0,0.424202,
-0.059652,15.876,0.9,0.912747,0.045727,0.405959,
0.09942,12.7008,0.9,0.912747,0.045727,0.405959,
0.9,12.7008,-0.9,0.912747,0.045727,0.405959,
-0.9,15.876,-0.9,-0,-0,-1,
-1.10375,9.5256,-1.04925,0.074222,0.039519,-0.996458,
-0.790611,12.7008,-0.9,0.074222,0.039519,-0.996458,
0.9,9.5256,-0.9,0.074222,0.039519,-0.996458,
-0.785653,6.3504,-0.9,0,-0.046953,-0.998897,
-1.10375,9.5256,-1.04925,0,-0.046953,-0.998897,
0.9,6.3504,-0.9,0,-0.046953,-0.998897,
-1.00934,3.1752,-0.9,-0.100438,0.007076,-0.994918,
-0.785653,6.3504,-0.9,-0.100438,0.007076,-0.994918,
0.994862,3.1752,-1.10233,-0.100438,0.007076,-0.994918,
-1.00934,3.1752,-0.9,-0,-0,-1,
-1.08967,-3.1752,-0.9,-0,0,-1,
-1.07075,-6.3504,-0.9,-0.144364,-0.00086,-0.989524,
-1.08967,-3.1752,-0.9,-0.144364,-0.00086,-0.989524,
0.748273,-6.3504,-1.16538,-0.144364,-0.00086,-0.989524,
-1.07075,-6.3504,-0.9,-0,-0,-1,
-1.08967,-12.7008,-0.875161,-0.013513,-0.006773,-0.999886,
-0.843188,-9.5256,-0.9,-0.013513,-0.006773,-0.999886,
0.748273,-12.7008,-0.9,-0.013513,-0.006773,-0.999886,
0.9,9.5256,-0.9,0.894427,0,0.447214,
0.9,12.7008,-0.9,0.894427,0,0.447214,
0,9.5256,0.9,0.894427,0,0.447214,
0.9,6.3504,-0.9,0.906116,0,0.423029,
0.9,9.5256,-0.9,0.906116,0,0.423029,
0.059652,6.3504,0.9,0.906116,0,0.423029,
0.994862,3.1752,-1.10233,0.89555,-0.001598,0.444957,
0.9,6.3504,-0.9,0.89555,-0.001598,0.444957,
0,3.1752,0.9,0.89555,-0.001598,0.444957,
0.937945,-1e-06,-0.9,0.907372,0.01051,0.420197,
0.994862,3.1752,-1.10233,0.907372,0.01051,0.420197,
0.104379,1e-06,0.9,0.907372,0.01051,0.420197,
1.03276,-3.1752,-0.9,0.867083,0.025891,0.497491,
0.937945,-1e-06,-0.9,0.867083,0.025891,0.497491,
0,-3.1752,0.9,0.867083,0.025891,0.497491,
0.748273,-6.3504,-1.16538,0.934283,-0.111997,0.338484,
1.03276,-3.1752,-0.9,0.934283,-0.111997,0.338484,
0,-6.3504,0.9,0.934283,-0.111997,0.338484,
0.9,-9.5256,-0.9,0.89157,0.079862,0.445785,
0.748273,-6.3504,-1.16538,0.89157,0.079862,0.445785,
0,-9.5256,0.9,0.89157,0.079862,0.445785,
0.748273,-12.7008,-0.9,0.922494,-0.044081,0.383487,
0.9,-9.5256,-0.9,0.922494,-0.044081,0.383487,
0,-12.7008,0.9,0.922494,-0.044081,0.383487,
-1.10375,9.5256,-1.04925,-0.902904,-0.070523,0.424017,
-0.785653,6.3504,-0.9,-0.902904,-0.070523,0.424017,
0.059652,6.3504,0.9,-0.902904,-0.070523,0.424017,
]),
indices : new Uint16Array([
0,1,2,
3,4,5,
6,7,8,
9,10,11,
12,13,14,
15,16,17,
18,19,20,
21,22,23,
24,25,26,
27,28,29,
30,31,32,
33,34,35,
36,37,38,
39,40,41,
42,43,44,
45,46,47,
48,49,50,
51,52,53,
54,55,56,
57,58,59,
60,61,62,
63,64,65,
66,67,68,
69,70,71,
72,73,74,
75,76,77,
78,79,80,
81,82,83,
84,85,86,
87,88,89,
90,91,92,
93,94,95,
96,97,98,
99,100,101,
102,103,104,
105,106,107,
108,109,110,
111,112,113,
114,115,116,
117,118,119,
120,121,122,
123,124,125,
39,126,40,
127,128,129,
45,130,46,
131,132,133,
134,135,136,
137,138,139,
57,140,58,
141,57,59,
142,143,144,
66,145,67,
146,147,148,
149,150,151,
152,153,154,
155,156,157,
158,159,160,
161,162,163,
164,165,166,
167,168,169,
170,171,172,
173,174,175,
]),
},

};

global.MESHES = MESHES;

})(window);
