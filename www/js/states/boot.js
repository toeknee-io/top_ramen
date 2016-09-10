app.boot = {}

app.boot.preload = function() {
	//app.game.load.audio('menu', 'assets/menu.ogg' );

	app.game.load.image('menu_bg', 'assets/bg4.jpg');

	// If logged in with FB
	$.get(
	  "http://www.toeknee.io:3000/api/users/57d3472a20f70c7e1eda2dfd/identities"
	).done(function(msg) {
		user = msg;
	  userPic = 'https://graph.facebook.com/me/picture?access_token='+[user][0][0]['credentials']['accessToken']+'&type=large';
	  userFriends = $.get('https://graph.facebook.com/me/friends?access_token='+[user][0][0]['credentials']['accessToken']);
	  app.game.load.image('userPic', userPic);
	}).fail(function(err) {
	  console.error("failed: " + err.message);
	});
}

app.boot.create = function() {
	console.log('Boot State');

	app.game.physics.startSystem(Phaser.Physics.ARCADE);
	//app.game.plugins.add(Fabrique.Plugins.InputField);

	app.game.forceSingleUpdate = true;

	app.game.stage.backgroundColor = "#111111";

	app.game.state.start('login');
}