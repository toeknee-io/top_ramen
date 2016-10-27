(function() {

  'use strict';

  app.challenges = {};

  app.challenges.preload = function() {

  	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  	app.game.kineticScrolling = app.game.plugins.add(Phaser.Plugin.KineticScrolling);

  	app.game.kineticScrolling.configure({
      kineticMovement: true,
      timeConstantScroll: 425,
      verticalScroll: true,
      horizontalScroll: false,
      verticalWheel: true
    });

    app.game.kineticScrolling.start();

    trApi.loadSocialImages().then(challenges => {
      app.game.load.onLoadComplete.addOnce(displayChallenges.bind(this, challenges));
      app.game.load.start();
    });

  };

  app.challenges.create = function() {

  	console.info('Challenges State');

  	let bg = app.game.add.image(0, 0, 'menu_bg');
  	bg.scale.setTo(scaleRatio * 2.05);
  	bg.fixedToCamera = true;

    let homeButton = app.game.add.button(30, 30, '', window.goHome);
    homeButton.loadTexture('main', 'home');
  	homeButton.scale.setTo(scaleRatio);

  };

  function displayChallenges(challenges) {

    /*

    let userPic;

  	if (app.game.cache.checkImageKey('myPic')) {

  		userPic = app.game.add.image(0, 260 * scaleRatio, 'myPic');

  	} else {

  		userPic = app.game.add.image(0, 260 * scaleRatio, 'chef');

  	}

  	userPic.scale.setTo(0.8 * scaleRatio);
  	userPic.x = app.game.world.centerX;
  	userPic.anchor.x = 0.5;

    */

  	let openGroupTitle = app.game.add.bitmapText(app.game.world.centerX, 230 * scaleRatio, 'fnt', 'open\nchallenges');
  	let finishedGroupTitle = app.game.add.bitmapText(app.game.world.centerX, 0, 'fnt', 'completed\nchallenges');

    let openGroup = app.game.add.group();
    let finishedGroup = app.game.add.group();

  	finishedGroup.add(finishedGroupTitle);

    ChallengeUtils.initGroupTitles([ openGroupTitle, finishedGroupTitle ]);

    let finishedStatuses,
    openStatuses = _.remove(finishedStatuses = Object.keys(challenges), status => status !== 'finished');

    let picY = 0;
    openGroup.y = openGroupTitle.y + 400 * scaleRatio;

    openStatuses.forEach(status => ChallengeUtils.displayChallenges(challenges[status], openGroup, picY));

  	let pic2Y = finishedGroupTitle.y + 400 * scaleRatio;
    finishedGroup.y = openGroup.height + 800 * scaleRatio;

    finishedStatuses.forEach(status => ChallengeUtils.displayChallenges(challenges[status], finishedGroup, pic2Y));

  	app.game.world.setBounds(0, 0, app.game.width, openGroup.height + finishedGroup.height + 1200 * scaleRatio);

  }

})();