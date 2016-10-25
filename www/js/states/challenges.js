(function() {

  'use strict';

  app.challenges = {};

  app.challenges.preload = function() {

  	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    app.game.load.image('bg', 'assets/bg4.jpg');

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

  	console.log('Challenges State');

  	var bg = app.game.add.image(0, 0, 'menu_bg');
  	bg.scale.setTo(scaleRatio * 2.05);
  	bg.fixedToCamera = true;

  	var homeButton = app.game.add.button(30, 30, 'home', window.goHome);
  	homeButton.scale.setTo(scaleRatio);

  };

  function displayChallenges(challenges) {

    /*let userPic;

  	if (app.game.cache.checkImageKey('myPic')) {

  		userPic = app.game.add.image(0, 260 * scaleRatio, 'myPic');

  	} else {

  		userPic = app.game.add.image(0, 260 * scaleRatio, 'chef');

  	}

  	userPic.scale.setTo(0.8 * scaleRatio);
  	userPic.x = app.game.world.centerX;
  	userPic.anchor.x = 0.5;

    */

  	var challengerGroup1 = app.game.add.group();
  	var challengerGroup2 = app.game.add.group();

  	var picY = 0;

  	var openGames = app.game.add.bitmapText(app.game.world.centerX, 230 * scaleRatio, 'fnt', 'open\nchallenges');
    openGames.align = 'center';
    openGames.scale.setTo(scaleRatio * 3);

  	var finishedGames = app.game.add.bitmapText(app.game.world.centerX, 0, 'fnt', 'completed\nchallenges');
    finishedGames.align = 'center';
    finishedGames.scale.setTo(scaleRatio * 3);

  	challengerGroup2.add(finishedGames);

  	openGames.anchor.x = 0.5;

  	finishedGames.anchor.x = 0.5;

  	challengerGroup1.y = openGames.y + 400 * scaleRatio;

    function processOpen(challenge) {

      try {

        let storedUserId = trApi.getUserId();

        let status = null;

        if (challenge.status !== 'new') {

          if (challenge.challenger.userId === storedUserId) {

      			if (challenge.challenger.score === null) {

      				status = 'Your Turn';

      			} else if (challenge.challenged.score === null) {

      				status = 'Their Turn';

      			}

      		} else if (challenge.challenged.userId === storedUserId) {

      			if (challenge.challenged.score === null) {

      				status = 'Your Turn';

      			} else if (challenge.challenger.score === null) {

      				status = 'Their Turn';

      			}

      		}

        }

        if (_.isEmpty(status))
          status = _.capitalize(challenge.status);

    		let challenger = challenge[challenge.challenger.userId === storedUserId ? 'challenged' : 'challenger'].identities[0];

        var butt = app.game.add.button(0, picY, 'item');

        let buttPic;
        let picKey = `${challenger.externalId}pic`;

        if (app.game.cache.checkImageKey(picKey)) {

          buttPic = app.game.add.image(30, 30, picKey);

        } else {

          buttPic = app.game.add.image(30, 30, 'chef');

        }

        var buttText = app.game.add.text(buttPic.width + 20, 30, challenger.profile.displayName, {
          font: 'bold 60px Arial',
          fill: '#fff',
          align: "right",
        } );

        var buttStatus = app.game.add.text(buttPic.width + 20, 120, status, {
          font: 'bold 40px Arial',
          fill: '#fff',
          align: "right",
        } );

        butt.onInputDown.add(function() {

        	var yLoc = app.game.world.y;

      		butt.onInputUp.add(function() {

      			if (yLoc === app.game.world.y) {

      				challengeStart(challenge);

      			}

      		}, challenge);

        });

        butt.scale.setTo(0.8 * scaleRatio);
        butt.centerX = app.game.world.centerX;

        butt.addChild(buttText);
        butt.addChild(buttPic);

        butt.addChild(buttStatus);

        buttPic.scale.setTo(0.8);

        challengerGroup1.add(butt);

        picY += 200 * scaleRatio;

      } catch (err) {
        console.error(err);
      }

    }

    _.forEach(challenges, (chalArray, status) => {
      if (status !== 'finished' && status !== 'declined')
        chalArray.forEach(processOpen);
    });

  	challengerGroup2.y = challengerGroup1.height + 800 * scaleRatio;

  	var pic2Y = finishedGames.y + 400 * scaleRatio;

    if (!Array.isArray(challenges.finished))
      challenges.finished = [];

  	challenges.finished.forEach(function(challenge) {

      try {

        let storedUserId = trApi.getUserId();

        let status;
        let opponent;

      	if (challenge.challenger.userId === storedUserId) {

          opponent = challenge.challenged.userId;

      	} else {

          opponent = challenge.challenger.userId;

      	}

      	if (challenge.winner === storedUserId) {

      		status = 'You Won!';

      	} else if (challenge.winner === "tied") {

      		status = 'Tied';

      	} else {

      		status = 'You Lost';

      	}

      	let challenger = challenge[challenge.challenger.userId === storedUserId ? 'challenged' : 'challenger'].identities[0];

        var butt = app.game.add.button(0, pic2Y, 'item');

        let buttPic;
        let picKey = `${challenger.externalId}pic`;

        if (app.game.cache.checkImageKey(picKey)) {

          buttPic = app.game.add.image(30, 30, picKey);

        } else {

          buttPic = app.game.add.image(30, 30, 'chef');

        }

        var buttText = app.game.add.text(buttPic.width + 20, 30, challenger.profile.displayName, {
          font: 'bold 60px Arial',
          fill: '#fff',
          align: "right",
        } );

        var buttStatus = app.game.add.text(buttPic.width + 20, 120, status, {
          font: 'bold 40px Arial',
          fill: '#fff',
          align: "right",
        } );

        butt.onInputDown.add(function() {

        	var yLoc = app.game.world.y;

      		butt.onInputUp.add(function() {

      			if (yLoc === app.game.world.y) {

      				challengeStart(challenge);

      			}

      		}, challenge);

        });

        butt.scale.setTo(0.8 * scaleRatio);
        butt.centerX = app.game.world.centerX;

        butt.addChild(buttText);
        butt.addChild(buttPic);

        butt.addChild(buttStatus);

        buttPic.scale.setTo(0.8);

        challengerGroup2.add(butt);

        pic2Y += 200 * scaleRatio;

      } catch (err) {
        console.error(err);
      }

  	});

  	app.game.world.setBounds(0, 0, app.game.width, challengerGroup1.height + challengerGroup2.height + 1200 * scaleRatio);

  }

  function challengeStart(challenge) {

    window.buttonSound();

    let player = challenge.challenger.userId === trApi.getUserId() ?
      'challenger' : 'challenged';

    let opponent = player !== 'challenger' ?
      'challenger' : 'challenged';

    console.log(`challengeStart with challenge.id: ${challenge.id}`);

  	if (challenge.status === 'finished') {

  		app.game.world.setBounds(0, 0, app.game.width, app.game.height);
  		app.game.state.start('challengeResults', true, false, challenge);

  	} else if (challenge.status === 'declined') {

      alert('This Challenge Was Declined!');

    } else if (challenge[player].score === null) {

      app.menuSong.stop();

      app.game.state.start('level', true, false, challenge.id, challenge.ramenId);

  	} else if (challenge[opponent].score === null) {

  		alert('Waiting For Opponent!');

  	}

  }
})();