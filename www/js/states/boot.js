app.boot = {}

app.boot.preload = function() {

	//app.game.load.audio('menu', 'assets/sounds/menu.ogg' );
	//app.game.load.audio('lvl', 'assets/sounds/orlvl.ogg' );
	app.game.load.audio('pop', 'assets/sounds/pop.ogg' );
	app.game.load.audio('lose', 'assets/sounds/lose.ogg' );

	app.game.load.image('menu_bg', 'assets/6.jpg');
	app.game.load.image('gameover_bg', 'assets/gameover-bg.jpg');
	app.game.load.image('item', 'assets/item_bg.png');
	app.game.load.image('home', 'assets/home.png');
	app.game.load.image('back', 'assets/back.png');

}

app.boot.create = function() {
	console.log('Boot State');

	app.game.physics.startSystem(Phaser.Physics.ARCADE);
	//app.game.plugins.add(Fabrique.Plugins.InputField);

	app.game.forceSingleUpdate = true;

	app.game.stage.backgroundColor = "#000000";

	app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

	setTimeout(function() {

		if (navigator.splashscreen) {

			navigator.splashscreen.hide();

		}

		setTimeout(function() {
			app.game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
			app.game.state.start('menu');
		}, 1000)

	}, 2400)	

}