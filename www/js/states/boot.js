(function appBootIife({ app, console }) {
  const boot = {};
  /* eslint-disable no-param-reassign */
  function loadComplete() {
    console.log('Boot State');

    app.game.physics.startSystem(Phaser.Physics.ARCADE);

    app.game.forceSingleUpdate = true;

    app.game.stage.backgroundColor = '#000000';

    app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio);

    app.game.sound.setDecodedCallback(['lose'], () => {
      if (window.navigator.splashscreen) {
        window.navigator.splashscreen.hide();
      }

      if (app.bootCreateCallback && typeof app.bootCreateCallback === 'function') {
        console.debug(`bootCreateCallback: ${app.bootCreateCallback}`);
        app.bootCreateCallback();
      } else {
        window.setTimeout(() => {
          app.game.scale.setGameSize(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio
          );
          app.game.state.start('menu');
        }, 1000);
      }
    });
  }

  boot.init = function appBootInit(musicOpt = window.localStorage.getItem('music')) {
    app.music = (_.isNil(musicOpt) || (musicOpt !== 'false' && musicOpt !== false));
    if (!app.sound) {
      app.sound = true;
    }
    window.localStorage.setItem('music', app.music);
  };

  boot.preload = function appBootPreload() {
    app.game.load.atlasJSONHash('main', 'assets/sheets/main.png', 'assets/sheets/main.json');

    app.game.load.image('menu_bg', 'assets/bg4.jpg');
    app.game.load.image('gameover_bg', 'assets/gameover-bg.jpg');
    app.game.load.image('delete', 'assets/delete.png');

    app.game.load.audio('lvl', 'assets/sounds/lvl2.ogg');
    app.game.load.audio('drum', 'assets/sounds/drumroll.ogg');
    app.game.load.audio('pop', 'assets/sounds/pop.ogg');
    app.game.load.audio('lose', 'assets/sounds/lose.ogg');
    app.game.load.audio('button', 'assets/sounds/button.ogg');
    app.game.load.audio('bonus', 'assets/sounds/bonus.ogg');
    app.game.load.audio('cat', 'assets/sounds/cat.ogg');
    app.game.load.audio('bad', 'assets/sounds/bad.ogg');
    app.game.load.audio('bug', 'assets/sounds/bug.ogg');
    app.game.load.audio('count', 'assets/sounds/count.ogg');
    app.game.load.audio('sake', 'assets/sounds/sake.ogg');

    app.game.load.bitmapFont('fnt', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    app.game.load.bitmapFont('fnt-orange', 'assets/fonts/font-orange.png', 'assets/fonts/font-orange.fnt');

    window.trApi.initUser()
      .catch(err => console.error('failed to trApi.initUser because: %O', err))
      .finally(() => {
        app.game.load.onLoadComplete.addOnce(loadComplete);
        app.game.load.start();
      });
  };

  /* app.boot.create = function() {

    app.game.state.start('level');

  }*/

  window.buttonSound = function buttonSound() {
    if (!app.buttonSound) {
      app.buttonSound = app.game.add.audio('button');
    }
    app.buttonSound.play();
  };

  Object.assign(app, { boot });
}(window));
