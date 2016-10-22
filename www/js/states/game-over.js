'use strict';

app.gameover = {};

app.gameover.init = function(score, challengeData) {

	app.gameover.score = score;
	app.gameover.challengeData = challengeData;

};

app.gameover.preload = function() {

	app.game.load.image('rematch', 'assets/rematch.png');
	app.game.load.bitmapFont('8bit', 'assets/fonts/8bit.png', 'assets/fonts/8bit.fnt' );

};

app.gameover.create = function() {

	console.log('Game Over State');

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  var bg = app.game.add.image(0, 0, 'gameover_bg');

  bg.scale.setTo(2.05 * scaleRatio);
  bg.x = app.game.world.centerX;
  bg.anchor.x = 0.5;
  bg.y = app.game.world.centerY;
  bg.anchor.y = 0.5;

  var homeButton = app.game.add.button(30, 30, 'home', window.goHome);

	homeButton.scale.setTo(scaleRatio);

	var welcomeText;

	if (app.gameover.challengeData !== false) {

		var resultText = '';

		var challengerScore = app.gameover.challengeData.challenger.score;
		var challengedScore = app.gameover.challengeData.challenged.score;

		var yourScore;
		var yourId;
		var theirScore;
		var theirId;

		if (app.gameover.challengeData.challenger.userId === trApi.getUserId()) {

			yourScore = challengerScore;
			theirScore = challengedScore;
			yourId = app.gameover.challengeData.challenger.userId;
			theirId = app.gameover.challengeData.challenged.userId;

		} else {

			yourScore = challengedScore;
			theirScore = challengerScore;
			yourId = app.gameover.challengeData.challenged.userId;
			theirId = app.gameover.challengeData.challenger.userId;

		}

		var yourScoreText;

		if (app.gameover.challengeData.status === "finished") {

			if (yourScore > theirScore) {

				resultText = 'You won!';

				//music = app.game.add.audio('win');

			} else if (yourScore === theirScore) {

				resultText = 'You tied!';

				//music = app.game.add.audio('lose');

			} else if (yourScore < theirScore) {

				resultText = 'You lost!';

				//music = app.game.add.audio('lose');

			}

			//music.play();

			welcomeText = app.game.add.bitmapText(app.game.world.centerX, 300 * scaleRatio, '8bit', resultText);
			welcomeText.scale.setTo(scaleRatio * 3);
			welcomeText.anchor.x = 0.5;

			yourScoreText = app.game.add.text(app.game.world.centerX, 800 * scaleRatio, 'Your score:\n' + yourScore, {
				font: 120 * scaleRatio + 'px Baloo Paaji',
				fill: '#fff',
				align: "center",
			});

			yourScoreText.anchor.x = 0.5;

			var theirScoreText = app.game.add.text(app.game.world.centerX, 1200 * scaleRatio, 'Their score:\n' + theirScore, {
				font: 120 * scaleRatio + 'px Baloo Paaji',
				fill: '#fff',
				align: "center",
			});

			theirScoreText.anchor.x = 0.5;

			var rematchButton = app.game.add.button(app.game.world.centerX, 1600 * scaleRatio, 'rematch', function() {

		  	trApi.postChallenge(theirId)
		  		.then(data => console.log(`Rematch! : ${data}`))
		  		.catch(err => console.error(`Failed because: ${err.responseJSON.error.message}`));

		  });

		  rematchButton.anchor.x = 0.5;

		} else {

			yourScoreText = app.game.add.text(app.game.world.centerX, 800 * scaleRatio, 'Your score:\n' + yourScore, {
				font: 120 * scaleRatio + 'px Baloo Paaji',
				fill: '#fff',
				align: "center",
			});

			yourScoreText.anchor.x = 0.5;

			var waitingText = app.game.add.text(app.game.world.centerX, 1200 * scaleRatio, "It's your opponent's turn!", {
				font: 90 * scaleRatio + 'px Baloo Paaji',
				fill: '#fff',
				align: "center",
			});

			waitingText.anchor.x = 0.5;

		}

	} else {

		welcomeText = app.game.add.text(app.game.world.centerX, 300 * scaleRatio, 'Your Score\n' + app.gameover.score + '!', {
			font: 120 * scaleRatio + 'px Baloo Paaji',
			fill: '#fff',
			align: "center",
		});

		welcomeText.anchor.x = 0.5;

	}

};