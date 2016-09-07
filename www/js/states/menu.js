app.menu = {}

app.menu.preload = function() {

	app.game.load.image('play_button','assets/button_play.png');
	app.game.load.image('challenge_button','assets/button_challenge.png');
	app.game.load.image('options_button','assets/button_options.png');

	app.game.load.image('fb_login','assets/fb_login.png');
	app.game.load.image('google','assets/google.png');
	app.game.load.image('regs','assets/regs.png');

}

app.menu.create = function() {
	console.log('Menu State');

	var buttonGroup = app.game.add.group();

	var playButton = app.game.add.button(0,0,'play_button', quickPlay);
	var challengeButton = app.game.add.button(0,75,'challenge_button', challenge);
	var optionsButton = app.game.add.button(0,150,'options_button', options);
	var fb = app.game.add.button(0,225,'fb_login', fbLogin);
	var googs = app.game.add.button(0,300,'google', googleLogin);
	var regs = app.game.add.button(0,375,'regs', regsLogin);

	buttonGroup.add(playButton);
	buttonGroup.add(challengeButton);
	buttonGroup.add(optionsButton);
	buttonGroup.add(fb);
	buttonGroup.add(googs);
	buttonGroup.add(regs);

	buttonGroup.forEach(buttonsSetup,this,true);

	function buttonsSetup(child) {
		child.scale.setTo(scaleRatio/3, scaleRatio/3);
	}

};

function quickPlay() {
	app.game.state.start('level');
}

function challenge() {

}

function options() {

}

function fbLogin() {

}

function googleLogin() {

}

function regsLogin() {

}