(function challengeIife({ app, scaleRatio, console }) {
  function playNow(challenge) {
    app.game.sound.stopAll();

    window.buttonSound();

    app.game.world.setBounds(0, 0, app.game.width, app.game.height);
    app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
  }

  function playLater() {
    this.destroy();
  }

  function challengeSentPopup(challenge) {
    const btnGroup = app.game.add.group();

    const lbBg = app.game.add.button(0, 0);
    lbBg.loadTexture('main', 'lightbox_bg');

    const sent = app.game.add.image(app.game.world.centerX, 0);
    sent.loadTexture('main', 'play_now');

    const yes = app.game.add.button(app.game.world.centerX, app.game.height / 2, '', playNow.bind(this, challenge));
    yes.loadTexture('main', 'yes');

    const no = app.game.add.button(app.game.world.centerX, 0, '', playLater, btnGroup);
    no.loadTexture('main', 'no');

    lbBg.width = app.game.width;
    lbBg.height = app.game.height;

    yes.scale.setTo(scaleRatio);
    yes.anchor.x = 0.5;
    yes.anchor.y = 0.5;

    sent.scale.setTo(scaleRatio);
    sent.y = yes.y - 500;
    sent.anchor.x = 0.5;

    no.scale.setTo(scaleRatio);
    no.y = yes.y + 170;
    no.anchor.x = 0.5;

    btnGroup.add(lbBg);
    btnGroup.add(sent);
    btnGroup.add(yes);
    btnGroup.add(no);

    btnGroup.fixedToCamera = true;
  }

  function challengeFn(friend) {
    console.log(`Challenged: ${friend.profile.displayName}`);

    const provider = 'facebook';

    window.trApi.getRamen().then((ramen) => {
      const rand = app.game.rnd.integerInRange(0, ramen.length - 1);

      const ramenId = ramen[rand].id;

      if (friend.provider === provider) {
        window.trApi.postChallenge(friend.userId, ramenId)
          .then(challenge => challengeSentPopup(challenge))
          .catch(err => console.error('trApi.postChallenge error: %O', err));
      }
    });
  }

  function displayFriends(userSocial) {
    const chefbar = app.game.add.image(app.game.world.centerX, app.game.world.height + 200, 'friendbar');
    chefbar.scale.setTo(scaleRatio);
    chefbar.fixedToCamera = true;
    chefbar.anchor.y = 1;
    chefbar.anchor.x = 0.5;

    let picY = 450 * scaleRatio;

    const friendGroup = app.game.add.group();

    if (app.game.state.current === 'challenge') {
      const welcomeText = app.game.add.bitmapText(app.game.world.centerX, 240 * scaleRatio, 'fnt', 'your friends');
      welcomeText.scale.setTo(scaleRatio * 3);
      welcomeText.anchor.x = 0.5;

      userSocial.facebook.friends.forEach((friend) => {
        const butt = app.game.add.button(0, picY);
        butt.loadTexture('main', 'item_bg');

        let yLoc;

        butt.onInputDown.add(() => {
          yLoc = app.game.world.y;
        });

        butt.onInputUp.add(() => {
          if (yLoc === app.game.world.y) {
            challengeFn(friend);
          }
        });

        butt.scale.setTo(0.8 * scaleRatio);
        butt.centerX = app.game.world.centerX;

        let buttPic;

        if (app.game.cache.checkImageKey(`${friend.externalId}pic`)) {
          buttPic = app.game.add.image(30, 30, `${friend.externalId}pic`);
        } else {
          buttPic = app.game.add.image(30, 30, 'main', 'chef-holder');
        }

        const buttText = app.game.add.text(buttPic.width + 20, 30, friend.profile.displayName, {
          font: 'bold 60px Baloo Paaji',
          fill: '#fff',
          align: 'right',
        });

        butt.addChild(buttText);
        butt.addChild(buttPic);

        buttPic.scale.setTo(0.8);

        friendGroup.add(butt);

        picY += 200 * scaleRatio;
      });

      app.game.world.setBounds(0, 0, app.game.width, friendGroup.height + (1000 * scaleRatio));
    }

    chefbar.bringToTop();
  }

  const challenge = {};

  challenge.preload = function appChallengePreload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    Object.assign(app.game, {
      kineticScrolling: app.game.plugins.add(Phaser.Plugin.KineticScrolling),
    });

    app.game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 425,
      verticalScroll: true,
      horizontalScroll: false,
      verticalWheel: true,
    });

    app.game.kineticScrolling.start();

    app.game.load.image('friendbar', 'assets/friendbar.png');

    window.trApi.getUserSocial()
      .then((userSocial) => {
        if (!app.game.cache.checkImageKey('myPic')) {
          app.game.load.image('myPic', userSocial.facebook.picture);
        }

        userSocial.facebook.friends.forEach((friend) => {
          const picKey = `${friend.externalId}pic`;

          if (!app.game.cache.checkImageKey(picKey)) {
            app.game.load.image(`${friend.externalId}pic`, `https://graph.facebook.com/${friend.externalId}/picture?type=large`);
          }
        });

        app.game.load.onLoadComplete.addOnce(displayFriends.bind(this, userSocial));

        app.game.load.start();
      });
  };

  challenge.create = function appChallengeCreate() {
    console.log('Challenge State');

    const bg = app.game.add.image(0, 0, 'menu_bg');
    bg.scale.setTo(scaleRatio * 2.5);
    bg.fixedToCamera = true;

    const homeButton = app.game.add.button(30, 30, '', window.goHome);
    homeButton.loadTexture('main', 'home');
    homeButton.scale.setTo(scaleRatio);
  };

  Object.assign(app, { challenge });
}(window));
