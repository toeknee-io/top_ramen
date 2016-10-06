app.challenges = {}

app.challenges.preload = function() {

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	app.game.kineticScrolling = app.game.plugins.add(Phaser.Plugin.KineticScrolling);

	app.game.kineticScrolling.configure({
    kineticMovement: true,
    verticalScroll: true,
    horizontalScroll: false,
    verticalWheel: true
  });

  app.game.kineticScrolling.start();

  app.game.load.image('userPic', userPic);

}

app.challenges.create = function() {
	
	console.log('Challenges State');

	var bg = app.game.add.image(0, 0, 'menu_bg');
	bg.scale.setTo(scaleRatio * 2.05);
	bg.fixedToCamera = true;

	var homeButton = app.game.add.button(30, 30, 'home', goHome);
	homeButton.scale.setTo(scaleRatio);

	var userPic = app.game.add.image(0, 260 * scaleRatio, 'userPic');
	userPic.scale.setTo(.8 * scaleRatio);
	userPic.x = app.game.world.centerX;
	userPic.anchor.x = .5;

	var welcomeText = app.game.add.text(userPic.width + 20, 160 * scaleRatio, 'Hi, ' + userName + '!', {
			font: 50 * scaleRatio + 'px Baloo Paaji',
			fill: '#fff',
			align: "right",
		});
	welcomeText.x = app.game.world.centerX;
	welcomeText.anchor.x = .5;

	trApi.getChallenges()
		.done(function(challenges) {

			var challengerGroup1 = app.game.add.group();
			var challengerGroup2 = app.game.add.group();

			var picY = 0;

			var status;

			var openGames = app.game.add.text(app.game.world.centerX, 530 * scaleRatio, 'Open Challenges', {
				font: 90 * scaleRatio + 'px Baloo Paaji',
				fill: '#fff',
				align: "center",
			});

			openGames.anchor.x = .5;

			challengerGroup1.y = openGames.y + 200 * scaleRatio;

			challenges.forEach(function(challenge) {

				if (challenge.status !== "finished") {

					if (challenge.challenger.userId === window.localStorage.getItem('userId')) {

	  				var opponent = challenge.challenged.userId;

	  			} else {

	  				var opponent = challenge.challenger.userId;

	  			}

					trApi.getOpponent(opponent)
						.done(function(challenger) {

							if (challenge.status === "new") {

								status = 'Open';

							} else if (challenge.challenger.userId === window.localStorage.getItem('userId')) {

								if (challenge.challenger.score === null) {

									status = 'Your Turn';

								} else if (challenge.challenged.score === null) {

									status = 'Their Turn';

								}

							} else if (challenge.challenged.userId === window.localStorage.getItem('userId')) {

								if (challenge.challenged.score === null) {

									status = 'Your Turn';

								} else if (challenge.challenger.score === null) {

									status = 'Their Turn';

								}

							}

							challenger = challenger[0];

				      var butt = app.game.add.button(0, picY, 'item');
				      var buttPic = app.game.add.image(30, 30, challenger.externalId + 'pic');
				      var buttText = app.game.add.text(buttPic.width + 20, 30, challenger.profile.displayName, {
				        font: 60 + 'px Baloo Paaji',
				        fill: '#fff',
				        align: "right",
				      } );

				      var buttStatus = app.game.add.text(buttPic.width + 20, 120, status, {
				        font: 40 + 'px Baloo Paaji',
				        fill: '#fff',
				        align: "right",
				      } );

				      butt.onInputDown.add(function() {

				      	var yLoc = app.game.world.y;

			      		butt.onInputUp.add(function() {

			      			if (yLoc === app.game.world.y) {

			      				challengeStart(this);

			      			}

			      		}, challenge);

				      });

				      butt.scale.setTo(.8 * scaleRatio);
				      butt.centerX = app.game.world.centerX;

				      butt.addChild(buttText);
				      butt.addChild(buttPic);
				      butt.addChild(buttStatus);

				      buttPic.scale.setTo(.8);

				      challengerGroup1.add(butt);

				      picY += 200 * scaleRatio;

				      app.game.world.setBounds(0, 0, app.game.width, challengerGroup1.height + challengerGroup2.height + 1000 * scaleRatio);

						})

				}

			});

			var pic2Y = 0;

			var finishedGames = app.game.add.text(app.game.world.centerX, challengerGroup1.height + 300 * scaleRatio, 'Completed Challenges', {
				font: 90 * scaleRatio + 'px Baloo Paaji',
				fill: '#fff',
				align: "center",
			});

			finishedGames.anchor.x = .5;

			challenges.forEach(function(challenge) {

				if (challenge.status === "finished") {

					if (challenge.challenger.userId === window.localStorage.getItem('userId')) {

	  				var opponent = challenge.challenged.userId;

	  			} else {

	  				var opponent = challenge.challenger.userId;

	  			}

					trApi.getOpponent(opponent)
						.done(function(challenger) {

							if (challenge.winner === window.localStorage.getItem('userId')) {

								status = 'You Won!';

							} else if (challenge.winner === "tied") {

								status = 'Tied';

							} else {

								status = 'You Lost';

							}

							challenger = challenger[0];

				      var butt = app.game.add.button(0, pic2Y, 'item');
				      var buttPic = app.game.add.image(30, 30, challenger.externalId + 'pic');
				      var buttText = app.game.add.text(buttPic.width + 20, 30, challenger.profile.displayName, {
				        font: 60 + 'px Baloo Paaji',
				        fill: '#fff',
				        align: "right",
				      } );

				      var buttStatus = app.game.add.text(buttPic.width + 20, 120, status, {
				        font: 40 + 'px Baloo Paaji',
				        fill: '#fff',
				        align: "right",
				      } );

				      butt.onInputDown.add(function() {

				      	var yLoc = app.game.world.y;

			      		butt.onInputUp.add(function() {

			      			if (yLoc === app.game.world.y) {

			      				challengeStart(this);

			      			}

			      		}, challenge);

				      });

				      butt.scale.setTo(.8 * scaleRatio);
				      butt.centerX = app.game.world.centerX;

				      butt.addChild(buttText);
				      butt.addChild(buttPic);
				      butt.addChild(buttStatus);

				      buttPic.scale.setTo(.8);

				      challengerGroup2.add(butt);

				      pic2Y += 200 * scaleRatio;

				      finishedGames.y = challengerGroup1.height + 900 * scaleRatio;

				      challengerGroup2.y = finishedGames.y + 200 * scaleRatio;

				      app.game.world.setBounds(0, 0, app.game.width, challengerGroup1.height + challengerGroup2.height + 1400 * scaleRatio);

						})

				}

			});

		})

}

function challengeStart(challenge) {

	if (challenge.status === 'finished') {

		app.game.world.setBounds(0, 0, app.game.width, app.game.height);
		app.game.state.start('challengeResults', true, false, challenge);

	} else if (((challenge.challenger.userId === window.localStorage.getItem('userId')) && (challenge.challenger.score === null)) || ((challenge.challenged.userId === window.localStorage.getItem('userId')) && (challenge.challenged.score === null))) {

		app.game.state.start('level', true, false, challenge.id);

	} else {

		alert('Waiting For Opponent!');

	}

}