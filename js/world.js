(function(global) {

/** This is just an interface for reference. */
function World() {}

/** Generate the contents of this world */
World.prototype.Generate = function(tunnel, progress) {}

/** We'll give them goofy names for debugging. */
World.prototype.name = function() { return ''; }

/** Some worlds only show up after a while. */
World.prototype.min_progress = function() { return 0; }

/** The material to use for rendering the tunnel. */
World.prototype.material = function() { return null; }

global.World = World;

})(window);
