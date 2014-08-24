(function(global) {

function Portal(game, material, pos, ori, world, world_in) {

  this.world_ = world;
  this.world_in_ = world_in;
  this.game_ = game;
  this.mesh_ = game.portal_frame_;
  this.mesh_stencil_ = game.portal_;
  this.material_ = material;
  this.pos_ = pos;

  var offset = vec3.create();
  offset[0] = Math.random() - 0.5;
  offset[1] = Math.random() - 0.5;
  vec3.normalize(offset, offset);
  vec3.scale(offset, offset, Math.random() * 8);

  vec3.transformQuat(pos, pos, ori)
  vec3.add(pos, pos, offset);

  this.transform_ = mat4.create();
  mat4.fromRotationTranslation(this.transform_, ori, pos);
}

Portal.prototype.Update = function() {
  // TODO collision detection!
}

// Gets whether |pt| lies in the triangle defined by |t1,t2,t3|.
// We ignore the z coordinate;
function tri_check(p, t0, t1, t2) {
  var area = 1/2*(-t1[1]*t2[0] + t0[1]*(-t1[0] + t2[0])
      + t0[0]*(t1[1] - t2[1]) + t1[0]*t2[1]);
  s = 1/(2*area)*(t0[1]*t2[0] - t0[0]*t2[1] + (t2[1] - t0[1])*p[0] + (t0[0] - t2[0])*p[1]);
  t = 1/(2*area)*(t0[0]*t1[1] - t0[1]*t1[0] + (t0[1] - t1[1])*p[0] + (t1[0] - t0[0])*p[1]);
  return (s>0 && t>0 && 1-s-t>0);
}

Portal.prototype.Draw = function(game) {
  if (global_clip < this.transform_[14])
    return;
  if (game.playerpos[2] < this.transform_[14])
    return;

  var pos = game.camera_.position_;

  if (game.world_idx_ == this.world_in_.i) {


    if (Math.abs(this.pos_[2] - pos[2]) < game.last_distance + 0.2) {
      var t0 = vec3.create();
      var t1 = vec3.create();
      var t2 = vec3.create();
      vec3.add(t0, this.pos_, vec3.fromValues(-3.22977, 2.00921, 0.0));
      vec3.add(t1, this.pos_, vec3.fromValues(3.22977, 2.00921, 0.0));
      vec3.add(t2, this.pos_, vec3.fromValues(0.0, -3.35485, 0.0));
      if (tri_check(pos, t0, t1, t2)) {
        game.world_idx_next_ = this.world_.i;
      }
    }
  }

  game.Draw(this.mesh_, this.world_.material(), this.transform_);


  if (portal_renders.length < kMaxPortalDepth) {

    portal_renders.push(this.world_.i);

    if (stencil_val == -1) {
      gl.stencilFunc(gl.ALWAYS, this.world_.i + 1, 255);
    }
    gl.stencilOp(gl.REPLACE, gl.KEEP, gl.REPLACE);

    global_clips.push(this.transform_[14]);
  }

  game.Draw(this.mesh_stencil_, this.game_.solid_, this.transform_);

  if (stencil_val == -1) {
    gl.stencilFunc(gl.ALWAYS, 255, 255);
  } else {
    gl.stencilFunc(gl.EQUAL, stencil_val, 255);
  }
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
}

global.Portal = Portal;

})(window);
