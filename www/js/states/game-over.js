app.gameover = {};

app.gameover.init = function(score, challengeData) {

	app.gameover.score = score;
	app.gameover.challengeData = challengeData;

	console.log(app.gameover.challengeData);

}

app.gameover.preload = function() {

	app.game.load.image('gameover_bg', 'assets/gameover-bg.jpg');
	app.game.load.image('home', 'assets/home.png');

}

app.gameover.create = function() {

	console.log('Game Over State');

	if (app.gameover.challengeData.status === "finished") {

		if (app.gameover.challengeData.winner === window.localStorage.userId) {



		} else {

			music = app.game.add.audio('lose');
  		music.play();

		}

	}

  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  var bg = app.game.add.image(0, 0, 'gameover_bg');

  bg.scale.setTo(2.05 * scaleRatio);
  bg.x = app.game.world.centerX;
  bg.anchor.x = .5;
  bg.y = app.game.world.centerY;
  bg.anchor.y = .5;

  var homeButton = app.game.add.button(30, 30, 'home', goHome);

	homeButton.scale.setTo(scaleRatio);

  var welcomeText = app.game.add.text(app.game.world.centerX, 300 * scaleRatio, 'Your Score\n' + app.gameover.score + '!', {
		font: 120 * scaleRatio + 'px Baloo Paaji',
		fill: '#fff',
		align: "center",
	});

	welcomeText.anchor.x = .5;

}