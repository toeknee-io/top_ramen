app.challengeResults = {}

app.challengeResults.init = function(challenge) {

	app.challengeResults.challengeData = challenge;

}

app.challengeResults.preload = function() {

	app.game.load.image('rematch', 'assets/rematch.png');

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

		resultText = 'You won!';

	} else if (app.challengeResults.challengeData.winner === "tied") {

		resultText = 'Tied!';

	} else {

		resultText = 'You lost';

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

	var welcomeText = app.game.add.text(app.game.world.centerX, 300 * scaleRatio, resultText, {
		font: 170 * scaleRatio + 'px Baloo Paaji',
		fill: '#fff',
		align: "center",
	});

	welcomeText.anchor.x = .5;

	var yourScoreText = app.game.add.text(app.game.world.centerX, 800 * scaleRatio, 'Your score:\n' + yourScore, {
		font: 120 * scaleRatio + 'px Baloo Paaji',
		fill: '#fff',
		align: "center",
	});

	yourScoreText.anchor.x = .5;

	var theirScoreText = app.game.add.text(app.game.world.centerX, 1200 * scaleRatio, 'Their score:\n' + theirScore, {
		font: 120 * scaleRatio + 'px Baloo Paaji',
		fill: '#fff',
		align: "center",
	});

	theirScoreText.anchor.x = .5;

	var rematchButton = app.game.add.button(app.game.world.centerX, 1600 * scaleRatio, 'rematch', function() {

  	trApi.postChallenge(theirId)
  		.done(function(data) {
  			console.log('Rematch! : ' + data);
  		}).fail(function(err) {
	   		console.error(`Failed because: ${err.responseJSON.error.message}`);
	    });

  });

  rematchButton.anchor.x = .5;
	
}