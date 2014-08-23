var s;

window.onload = function() {
  var ua_result = check_ua();
  if (ua_result != '') {
    console.log('Failed UserAgent capability check: ' + ua_result);
    // We failed, TODO: show a sadface or something.
    return;
  }

  s = new Spline();

  var pts = new Array();

  for (var i = 0; i < 10; ++i) {
    var v = vec3.create();
    v[0] = 0;
    v[1] = 0;
    v[2] = i * 5;
    console.log(v);
    s.AddPoint(v);
  }

  var game = new Game(document.querySelector('canvas'));
  game.Start();
  game.Tick();
}

