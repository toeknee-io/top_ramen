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

  app.game.load.image('home', 'assets/home.png');
  app.game.load.image('userPic', userPic);

  challenges.forEach(function(challenger) {
  	trApi.loadChallengeImages(challenger.challenger.userId);
  })
	
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

	var challengerGroup = app.game.add.group();

	var picY = 500 * scaleRatio;

	challenges.forEach(function(challenge) {

		trApi.createChallengedButton(challenge, picY, challengerGroup);

		picY += 200 * scaleRatio;

	});

	app.game.world.setBounds(0, 0, app.game.width, challengerGroup.height + 600 * scaleRatio);

}

function challengeStart() {
	app.game.state.start('level', true, false, this.id);
}