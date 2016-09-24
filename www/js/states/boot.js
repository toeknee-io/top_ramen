app.boot = {}

var facebook;
var userPic;
var userName = '';
var userFBFriends;
var isLoggedIn;

app.boot.preload = function() {
	//app.game.load.audio('menu', 'assets/menu.ogg' );
	//app.game.load.audio('lvl', 'assets/orlvl.ogg' );

	app.game.load.image('menu_bg', 'assets/bg4.jpg');
}

app.boot.create = function() {
	console.log('Boot State');

	app.game.physics.startSystem(Phaser.Physics.ARCADE);
	//app.game.plugins.add(Fabrique.Plugins.InputField);

	app.game.forceSingleUpdate = true;

	app.game.stage.backgroundColor = "#111111";

	app.game.state.start('login');
}