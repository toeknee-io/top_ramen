app.challengeResults = {}

app.challengeResults.init = function(challenge) {

	app.challengeResults.challengeData = challenge;

}

app.challengeResults.create = function() {

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  var bg = app.game.add.image(0, 0, 'gameover_bg');

  bg.scale.setTo(2.05 * scaleRatio);
  bg.x = app.game.world.centerX;
  bg.anchor.x = .5;
  bg.y = app.game.world.centerY;
  bg.anchor.y = .5;

  var backButton = app.game.add.button(30, 30, 'back', function() {

  	app.game.state.start('challenges');

  });

	backButton.scale.setTo(scaleRatio);

	var resultText = '';

	if (app.challengeResults.challengeData.winner === window.localStorage.userId) {

		resultText = 'you won!';

	} else if (app.challengeResults.challengeData.winner === "tied") {

		resultText = 'tied!';

	} else {

		resultText = 'you lost';

	}

	var challengerScore = app.challengeResults.challengeData.challenger.score;
	var challengedScore = app.challengeResults.challengeData.challenged.score;

	var yourScore;
	var yourId;
	var theirScore;
	var theirId;

	if (app.challengeResults.challengeData.challenger.userId === window.localStorage.getItem('userId')) {

		yourScore = challengerScore;
		theirScore = challengedScore;
		yourId = app.challengeResults.challengeData.challenger.userId;
		theirId = app.challengeResults.challengeData.challenged.userId;

	} else {

		yourScore = challengedScore;
		theirScore = challengerScore;
		yourId = app.challengeResults.challengeData.challenged.userId;
		theirId = app.challengeResults.challengeData.challenger.userId;

	}

	var welcomeText = app.game.add.bitmapText(app.game.world.centerX, 400 * scaleRatio, 'fnt-orange', resultText);
			welcomeText.scale.setTo(scaleRatio * 5);
			welcomeText.anchor.x = .5;

	var yourScoreText = app.game.add.bitmapText(app.game.world.centerX, 800 * scaleRatio, 'fnt', 'your score:\n' + yourScore);
	yourScoreText.align = 'center';
	yourScoreText.scale.setTo(scaleRatio * 3);
	yourScoreText.anchor.x = .5;

	var theirScoreText = app.game.add.bitmapText(app.game.world.centerX, 1200 * scaleRatio, 'fnt', 'their score:\n' + theirScore);
	theirScoreText.align = 'center';
	theirScoreText.scale.setTo(scaleRatio * 3);
	theirScoreText.anchor.x = .5;

	var rematchButton = app.game.add.button(app.game.world.centerX, 1700 * scaleRatio, 'rematch', () => {
  	trApi.postChallenge(theirId)
      .then(data => console.log('Rematch! : ' + data))
      .catch(err => console.error(`Failed because: ${err.responseJSON.error.message}`));
  });

  rematchButton.anchor.x = .5;

}