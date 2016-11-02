(function appMenuIife({ app, scaleRatio }) {
  const menu = {};

  let imageSize = '';

  menu.init = function () {
    if (!app.menuSong) {
      app.menuSong = app.game.add.audio('lose', 0.8, true);
    }

    if (!app.lvlSong) {
      app.lvlSong = app.game.add.audio('lvl', 0.7, true);
    }
  };

  menu.preload = function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    app.game.load.image('chefbar', 'assets/chefbar.png');
    app.game.load.image('not_logged', 'assets/not_logged.png');

    if (!imageSize) imageSize = '';

    if (window.devicePixelRatio === 2) {
            // imageSize = 'X2';
    } else if (window.devicePixelRatio >= 3) {
      imageSize = 'LG';
    }
  };

  menu.create = function appMenuCreate() {
    if (!app.menuSong.isPlaying && window.app.music) {
      app.menuSong.play();
    }

    const bg = app.game.add.image(0, 0, 'menu_bg');
    bg.scale.setTo(2.5 * scaleRatio);

    const title = app.game.add.image(app.game.world.centerX, 160 * scaleRatio, 'main', 'title2');
    title.anchor.x = 0.5;
    title.scale.setTo(scaleRatio);

    const buttonGroup = app.game.add.group();

    const playButton = app.game.add.button(0, 0, '', quickPlay);
    playButton.loadTexture('main', 'button_play2');

    const challengeButton = app.game.add.button(0, 0, '', challenge);
    challengeButton.loadTexture('main', 'button_challenge2');

    const challengesButton = app.game.add.button(0, 0, '', challenges);
    challengesButton.loadTexture('main', 'button_challenges2');

    const isLoggedIn = window.trApi.isLoggedIn();

    challengeButton.alpha = isLoggedIn ? 1 : 0.4;
    challengesButton.alpha = isLoggedIn ? 1 : 0.4;

    const btnImg = isLoggedIn ? 'fb_logout2' : 'fb_login2';
    const btnFn = isLoggedIn ? logout : fbLogin;

    const fb = app.game.add.button(0, 0, '', btnFn);
    fb.loadTexture('main', btnImg);

        // var regs = app.game.add.button(0, 0, 'login_button', regsLogin);

    buttonGroup.add(playButton);
    buttonGroup.add(challengeButton);
    buttonGroup.add(challengesButton);
    buttonGroup.add(fb);

    buttonGroup.y = title.bottom + 70 * scaleRatio;

    let buttonSpacer = 0;

    buttonGroup.forEach(buttonsSetup, this, true);

    function buttonsSetup(child) {
      child.scale.setTo(scaleRatio);
      child.x = app.game.world.centerX;
      child.anchor.x = 0.5;
      child.y = buttonSpacer * scaleRatio;
      buttonSpacer += 200;
    }

    const chefbar = app.game.add.image(app.game.world.centerX, app.game.world.height, 'chefbar');
    chefbar.scale.setTo(scaleRatio);
    chefbar.anchor.y = 1;
    chefbar.anchor.x = 0.5;

    const optionsGroup = app.game.add.group();

    let sound;
    let music;

    sound = app.game.add.button(0, 500, '', soundToggle, sound);
    sound.loadTexture('main', 'sound');

    music = app.game.add.button(sound.left - 80 * scaleRatio, 500, '', musicToggle, music);
    music.loadTexture('main', 'music');

    sound.scale.setTo(scaleRatio);
    music.scale.setTo(scaleRatio);
    music.anchor.x = 1;
    music.anchor.y = 0.5;
    sound.anchor.y = 0.5;

    if (app.sound) {
      sound.alpha = 1;
    } else {
      sound.alpha = 0.4;
    }

    if (app.music) {
      music.alpha = 1;
    } else {
      music.alpha = 0.4;
    }

    optionsGroup.add(music);
    optionsGroup.add(sound);
    optionsGroup.x = app.game.width * 0.85;
    optionsGroup.y = (app.game.height * 0.98) - (music.height / 2);

    const optionsButton = app.game.add.button(app.game.width * 0.1, chefbar.bottom, '', options, optionsGroup);
    optionsButton.loadTexture('main', 'cog');
    optionsButton.scale.setTo(scaleRatio);
    optionsButton.anchor.x = 0.5;
    optionsButton.anchor.y = 0.5;
    optionsButton.y = (app.game.world.height * 0.98) - optionsButton.height / 2;

    const tween = this.add.tween(optionsButton).to({ angle: +360 }, 3500, Phaser.Easing.Linear.None, true, 0, -1);
  };

  function quickPlay() {
    app.game.sound.stopAll();

    window.buttonSound();

    const rand = app.game.rnd.integerInRange(1, 3);

    let ramenId = 'shoyu';

    if (rand === 1) {
      ramenId = 'shoyu';
    } else if (rand === 2) {
      ramenId = 'tonkotsu';
    } else if (rand === 3) {
      ramenId = 'spicy_chicken';
    }

    app.game.state.start('level', true, false, false, ramenId);
  }

  function challenge() {
    window.buttonSound();
    if (window.trApi.isLoggedIn()) {
      app.game.state.start('challenge');
    } else {
      const notLogged = app.game.add.button(0, 0, 'not_logged', () => {
        notLogged.destroy();
      });
      notLogged.scale.setTo(scaleRatio);
      notLogged.x = app.game.world.centerX;
      notLogged.anchor.x = 0.5;
      notLogged.y = app.game.world.centerY;
      notLogged.anchor.y = 0.5;
    }
  }

  function challenges() {
    window.buttonSound();
    if (window.trApi.isLoggedIn()) {
      app.game.state.start('challenges');
    } else {
      const notLogged = app.game.add.button(0, 0, 'not_logged', () => notLogged.destroy());

      notLogged.scale.setTo(scaleRatio);
      notLogged.x = app.game.world.centerX;
      notLogged.anchor.x = 0.5;
      notLogged.y = app.game.world.centerY;
      notLogged.anchor.y = 0.5;
    }
  }

  function options() {
    window.buttonSound();

    const self = this;

    if (self.children[0].y !== 0) {
      app.game.add.tween(self.children[0]).to({ y: 0 }, 250, Phaser.Easing.easeIn, true, 0, 0, false);

      setTimeout(() => {
        app.game.add.tween(self.children[1]).to({ y: 0 }, 250, Phaser.Easing.easeIn, true, 0, 0, false);
      }, 200);
    } else {
      app.game.add.tween(self.children[0]).to({ y: 500 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);

      setTimeout(() => {
        app.game.add.tween(self.children[1]).to({ y: 500 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
      }, 150);
    }
  }

  function soundToggle() {
        // jshint ignore:start
    if (app.sound === true) {
      app.sound = false;

      this.alpha = 0.4;
    } else if (app.sound === false) {
      app.sound = true;

      this.alpha = 1;
    }

    window.buttonSound();
  }

  function musicToggle() {
    window.buttonSound();

    if (app.music === true) {
      app.music = false;

      this.alpha = 0.4;

      app.menuSong.volume = 0;
      app.lvlSong.volume = 0;
    } else if (app.music === false) {
      app.music = true;
      this.alpha = 1;

      app.menuSong.volume = 0.8;
      app.lvlSong.volume = 0.8;

    }

    if (!app.menuSong.isPlaying && app.music) {
      app.menuSong.play();
    }

    window.localStorage.setItem('music', app.music);
  }

  function fbLogin() {
    login('facebook');
    window.buttonSound();
  }

  function logout() {
    window.trApi.logUserOut()
            .then(() => app.game.state.restart())
            .catch(err => console.error(`Logout failed ${err}`));
    window.buttonSound();
  }

  function regsLogin() {
    	login('local');
    window.buttonSound();
  }

  function login(provider, opts = {}) {
    if (typeof opts.iab !== 'string') opts.iab = 'location=no,zoom=no';

    opts.provider = provider;

    window.window.trApi.logUserIn(opts)
        .then(() => {
          app.game.state.restart();
          window.window.trApi.getAppInstallations()
                .then((installations) => {
                  const existingInstall = _.find(installations, install => install.deviceToken === window.trApi.getDeviceToken());
                  if (_.isEmpty(existingInstall)) window.trApi.postAppInstallation();
                })
                .catch((err) => {
                  console.error(`Failed to getAppInstallations in logUserIn ${err}`);
                  if (!_.isEmpty(window.trApi.getDeviceToken()) && window.trApi.isLoggedIn()) { window.trApi.postAppInstallation(); }
                });
        })
        .catch(err => console.error(`logUserIn failed: ${err}`));
  }

  Object.assign(app, { menu });
}(window));
