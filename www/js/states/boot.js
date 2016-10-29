window.app.boot = {};

function loadComplete() {
  console.log('Boot State');

  window.app.game.physics.startSystem(Phaser.Physics.ARCADE);

  window.app.game.forceSingleUpdate = true;

  window.app.game.stage.backgroundColor = '#000000';

  window.app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio);

  window.app.game.sound.setDecodedCallback(['lose'], () => {
    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }

    if (window.app.bootCreateCallback && typeof window.app.bootCreateCallback === 'function') {
      console.log(`bootCreateCallback: ${window.app.bootCreateCallback}`);
      window.app.bootCreateCallback();
    } else {
      setTimeout(() => {
        window.app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio,
          window.innerHeight * window.devicePixelRatio);
        window.app.game.state.start('menu');
      }, 1000);
    }
  });
}

window.app.boot.init = function appBootInit() {
  const musicOpt = window.localStorage.getItem('music');

  window.app.music = (_.isNil(musicOpt) || (musicOpt !== 'false' && musicOpt !== false));

  if (!window.app.sound) {
    window.app.sound = true;
  }

  window.localStorage.setItem('music', window.app.music);
};

window.app.boot.preload = function appBootPreload() {
  window.app.game.load.atlasJSONHash('main', 'assets/sheets/main.png', 'assets/sheets/main.json');

  window.app.game.load.image('menu_bg', 'assets/bg4.jpg');
  window.app.game.load.image('gameover_bg', 'assets/gameover-bg.jpg');

  window.app.game.load.audio('lvl', 'assets/sounds/lvl2.ogg');
  window.app.game.load.audio('drum', 'assets/sounds/drumroll.ogg');
  window.app.game.load.audio('pop', 'assets/sounds/pop.ogg');
  window.app.game.load.audio('lose', 'assets/sounds/lose.ogg');
  window.app.game.load.audio('button', 'assets/sounds/button.ogg');
  window.app.game.load.audio('bonus', 'assets/sounds/bonus.ogg');
  window.app.game.load.audio('cat', 'assets/sounds/cat.ogg');
  window.app.game.load.audio('bad', 'assets/sounds/bad.ogg');
  window.app.game.load.audio('bug', 'assets/sounds/bug.ogg');
  window.app.game.load.audio('count', 'assets/sounds/count.ogg');
  window.app.game.load.audio('sake', 'assets/sounds/sake.ogg');

  window.app.game.load.bitmapFont('fnt', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
  window.app.game.load.bitmapFont('fnt-orange', 'assets/fonts/font-orange.png', 'assets/fonts/font-orange.fnt');

  window.trApi.loadSocialImages().then(() => {
    window.app.game.load.onLoadComplete.addOnce(loadComplete, this);
    window.app.game.load.start();
  });
};

/* window.app.boot.create = function() {

  window.app.game.state.start('level');

}*/

window.buttonSound = function buttonSound() {
  if (!window.app.buttonSound) {
    window.app.buttonSound = window.app.game.add.audio('button');
  }

  window.app.buttonSound.play();
};
