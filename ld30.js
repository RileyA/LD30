window.onload = function() {
  var ua_result = check_ua();
  if (ua_result != '') {
    console.log('Failed UserAgent capability check: ' + ua_result);
    // We failed, TODO: show a sadface or something.
    return;
  }

  var game = new Game(document.querySelector('canvas'));
  game.Start();
  game.Tick();
}

