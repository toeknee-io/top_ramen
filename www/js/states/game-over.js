'use strict';

app.gameover = {};

app.gameover.init = function(score, challengeData) {

	app.gameover.score = score;
	app.gameover.challengeData = challengeData;

};

app.gameover.create = function() {

	console.log('Game Over State');

  window.facebookConnectPlugin.showDialog(
    {
      method: 'share',
      href: 'http://bitsmittenstudios.com',
      caption: `I scored ${app.gameover.score}!`,
      description: 'Download Top Ramen now for free!',
    },
    (obj) => {
      if (obj) {
        if (obj.completionGesture === 'cancel') {
          console.log('cancel');
        } else {
          console.log('success');
          console.log(obj);
        }
      } else {
        console.log('no object');
      }
    },
    (obj) => {
      console.log('fail');
      console.log(obj);
    }
  );

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  var bg = app.game.add.image(0, 0, 'gameover_bg');

  bg.scale.setTo(2.05 * scaleRatio);
  bg.x = app.game.world.centerX;
  bg.anchor.x = 0.5;
  bg.y = app.game.world.centerY;
  bg.anchor.y = 0.5;

  var homeButton = app.game.add.button(30, 30, '', window.goHome);
  homeButton.loadTexture('main', 'home');
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

				resultText = 'you won!';

				//music = app.game.add.audio('win');

			} else if (yourScore === theirScore) {

				resultText = 'you tied!';

				//music = app.game.add.audio('lose');

			} else if (yourScore < theirScore) {

				resultText = 'you lost!';

				//music = app.game.add.audio('lose');

			}

			//music.play();

			welcomeText = app.game.add.bitmapText(app.game.world.centerX, 300 * scaleRatio, 'fnt-orange', resultText);
			welcomeText.scale.setTo(scaleRatio * 4);
			welcomeText.align = 'center';
			welcomeText.anchor.x = 0.5;

			yourScoreText = app.game.add.bitmapText(app.game.world.centerX, 800 * scaleRatio, 'fnt', 'your score:\n' + yourScore);
			yourScoreText.scale.setTo(scaleRatio * 3);
			yourScoreText.align = 'center';
			yourScoreText.anchor.x = 0.5;

			var theirScoreText = app.game.add.bitmapText(app.game.world.centerX, 1200 * scaleRatio, 'fnt', 'their score:\n' + theirScore);
			theirScoreText.scale.setTo(scaleRatio * 3);
			theirScoreText.align = 'center';
			theirScoreText.anchor.x = 0.5;

			var rematchButton = app.game.add.button(app.game.world.centerX, 1600 * scaleRatio, '', function() {

		  	trApi.postChallenge(theirId)
		  		.then(data => console.log(`Rematch! : ${data}`))
		  		.catch(err => console.error(`Failed because: ${err.responseJSON.error.message}`));

		  });
			rematchButton.loadTexture('main', 'rematch');
		  rematchButton.anchor.x = 0.5;

		} else {

			yourScoreText = app.game.add.bitmapText(app.game.world.centerX, 800 * scaleRatio, 'fnt', 'your score:\n' + yourScore);
			yourScoreText.scale.setTo(scaleRatio * 3);
			yourScoreText.align = 'center';
			yourScoreText.anchor.x = 0.5;

			var waitingText = app.game.add.bitmapText(app.game.world.centerX, 1200 * scaleRatio, 'fnt-orange', "it's your opponent's turn!");
			waitingText.scale.setTo(scaleRatio * 2);
			waitingText.align = 'center';
			waitingText.anchor.x = 0.5;

		}

	} else {
		welcomeText = app.game.add.bitmapText(app.game.world.centerX, 300 * scaleRatio, 'fnt-orange', 'your score\n' + app.gameover.score + '!');
		welcomeText.scale.setTo(scaleRatio * 4);
		welcomeText.align = 'center';
		welcomeText.anchor.x = 0.5;
	}

};