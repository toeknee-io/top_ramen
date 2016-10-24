'use strict';

app.boot = {};

app.boot.init = function() {

	if (!app.music)
		app.music = true;

	if (!app.sound)
		app.sound = true;

};

app.boot.preload = function() {

	app.game.load.image('bg', 'assets/bg4.jpg');
	app.game.load.image('lb_bg', 'assets/lightbox_bg.png');
	app.game.load.image('close', 'assets/close.png');
	app.game.load.image('chef', 'assets/chef-holder.png');
	app.game.load.image('music', 'assets/music.png');
	app.game.load.image('sound', 'assets/sound.png');

	app.game.load.audio('lvl', 'assets/sounds/lvl2.ogg' );
	app.game.load.audio('drum', 'assets/sounds/drumroll.ogg' );
	app.game.load.audio('pop', 'assets/sounds/pop.ogg' );
	app.game.load.audio('lose', 'assets/sounds/lose.ogg' );
	app.game.load.audio('button', 'assets/sounds/button.ogg' );
	app.game.load.audio('bonus', 'assets/sounds/bonus.ogg' );
  app.game.load.audio('cat', 'assets/sounds/cat.ogg' );
  app.game.load.audio('bad', 'assets/sounds/bad.ogg' );
  app.game.load.audio('bug', 'assets/sounds/bug.ogg' );
  app.game.load.audio('count', 'assets/sounds/count.ogg' );

	app.game.load.image('menu_bg', 'assets/6.jpg');
	app.game.load.image('gameover_bg', 'assets/gameover-bg.jpg');
	app.game.load.image('item', 'assets/item_bg.png');
	app.game.load.image('home', 'assets/home.png');
	app.game.load.image('back', 'assets/back.png');

	trApi.loadSocialImages().then(() => {
		app.game.load.onLoadComplete.addOnce(loadComplete, this);
		app.game.load.start();
	});

};

/*app.boot.create = function() {

	app.game.state.start('level');

}*/

function loadComplete() {

	console.log('Boot State');

	app.game.physics.startSystem(Phaser.Physics.ARCADE);
	//app.game.plugins.add(Fabrique.Plugins.InputField);

	app.game.forceSingleUpdate = true;

	app.game.stage.backgroundColor = "#000000";

	app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

	app.game.sound.setDecodedCallback(['lose'], function() {

		if (navigator.splashscreen) {

			navigator.splashscreen.hide();

		}

		if (app.bootCreateCallback && typeof app.bootCreateCallback === 'function') {
			console.log(`bootCreateCallback: ${app.bootCreateCallback}`);
			app.bootCreateCallback();
		} else {
			setTimeout(function() {
				app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
				app.game.state.start('menu');
			}, 1000);
		}

	});

}

window.buttonSound = function() {

	if (!app.buttonSound)
		app.buttonSound = app.game.add.audio('button');

	app.buttonSound.play();

};