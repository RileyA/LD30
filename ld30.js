var game;

window.onload = function() {
  var ua_result = check_ua();
  if (ua_result != '') {
    console.log('Failed UserAgent capability check: ' + ua_result);
    // We failed, TODO: show a sadface or something.
    return;
  }

  game = new Game(document.querySelector('canvas'));
  game.Start();
  game.Tick();

  function begin() {
    document.querySelector('body').removeEventListener('click', begin);
    document.querySelector('body').removeEventListener('keydown', begin);
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('instruction').style.display = 'none';
    game.RequestPointer();
  }

  document.querySelector('body').addEventListener('click', begin);
  document.querySelector('body').addEventListener('keydown', begin);
}


