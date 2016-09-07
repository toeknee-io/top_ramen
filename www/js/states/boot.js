app.boot = {}

app.boot.preload = function() {
	//app.game.load.audio('menu', 'assets/menu.ogg' );
}

app.boot.create = function() {
	console.log('Boot State');

	app.game.physics.startSystem(Phaser.Physics.ARCADE);
	//app.game.plugins.add(Fabrique.Plugins.InputField);

	app.game.forceSingleUpdate = true;

	app.game.stage.backgroundColor = "#111111";

	app.game.state.start('login');
}