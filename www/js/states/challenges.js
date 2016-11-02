(function challengesIife({ app, scaleRatio }, challenges) {
  function displayChallenges(userChallenges) {
    const openGroupTitle = app.game.add.bitmapText(app.game.world.centerX, 230 * scaleRatio, 'fnt', 'open\nchallenges');
    const finishedGroupTitle = app.game.add.bitmapText(app.game.world.centerX, 0, 'fnt', 'completed\nchallenges');

    const openGroup = app.game.add.group();
    const finishedGroup = app.game.add.group();

    finishedGroup.add(finishedGroupTitle);

    ChallengeUtils.initGroupTitles([openGroupTitle, finishedGroupTitle]);

    let finishedStatuses;
    const openStatuses = _.remove(finishedStatuses = Object.keys(userChallenges), status => status !== 'finished');

    const picY = 0;
    openGroup.y = openGroupTitle.y + (400 * scaleRatio);

    openStatuses.forEach(status =>
      ChallengeUtils.displayChallengeGroup(userChallenges[status], openGroup, picY)
    );

    const pic2Y = finishedGroupTitle.y + (400 * scaleRatio);
    finishedGroup.y = openGroup.height + (800 * scaleRatio);

    finishedStatuses.forEach(status =>
      ChallengeUtils.displayChallengeGroup(userChallenges[status], finishedGroup, pic2Y)
    );

    app.game.world.setBounds(0, 0, app.game.width,
      openGroup.height + finishedGroup.height + (1200 * scaleRatio));
  }

  const preload = function challengesPreload() {
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

    window.trApi.loadSocialImages().then((userChallenges) => {
      app.game.load.onLoadComplete.addOnce(displayChallenges.bind(app, userChallenges));
      app.game.load.start();
    }).catch(err => console.error('trApi.loadSocialImages err: %O', err));
  };

  const create = function challengesCreate() {
    console.info('Challenges State');

    const bg = app.game.add.image(0, 0, 'menu_bg');
    bg.scale.setTo(scaleRatio * 2.5);
    bg.fixedToCamera = true;

    const homeButton = app.game.add.button(30, 30, '', window.goHome);
    homeButton.loadTexture('main', 'home');
    homeButton.scale.setTo(scaleRatio);
  };

  Object.assign(challenges, { preload, create });
  Object.assign(app, { challenges });
}(window, {}));
