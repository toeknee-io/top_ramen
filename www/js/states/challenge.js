app.challenge = {}

var fbFriendsArray;

app.challenge.preload = function() {
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	app.game.kineticScrolling = app.game.plugins.add(Phaser.Plugin.KineticScrolling);

	app.game.kineticScrolling.configure({
        kineticMovement: true,
        verticalScroll: true,
        horizontalScroll: false,
        verticalWheel: true
    });

    app.game.kineticScrolling.start();

	if (facebook) {
		fbFriendsArray = userFBFriends.responseJSON.data;
		fbFriendsArray.forEach(function(friend) {
			var friendPic = 'https://graph.facebook.com/' + friend.id + '/picture?type=large';
			app.game.load.image(friend.id + 'pic', friendPic);
		});
	}

	app.game.load.image('home', 'assets/home.png');
    app.game.load.image('item', 'assets/item_bg.png');
    app.game.load.image('userPic', userPic);

}

app.challenge.create = function() {
	console.log('Challenge State');

	var bg = app.game.add.image(0, 0, 'menu_bg');
	bg.scale.setTo(scaleRatio * 2.05);
	bg.fixedToCamera = true;

	var homeButton = app.game.add.button(30, 30, 'home', goHome);
	homeButton.scale.setTo(scaleRatio);

	var userPic = app.game.add.image(0, 260 * scaleRatio, 'userPic');
	userPic.scale.setTo(.8*scaleRatio);
	userPic.x = app.game.world.centerX;
	userPic.anchor.x = .5;

	var welcomeText = app.game.add.text(userPic.width + 20, 160 * scaleRatio, 'Hi, ' + userName + '!', {
			font: 50 * scaleRatio + 'px Baloo Paaji',
			fill: '#fff',
			align: "right",
		});
	welcomeText.x = app.game.world.centerX;
	welcomeText.anchor.x = .5;

	if (facebook) {
		fbLoad(fbFriendsArray);
	}
}

function goHome() {
	app.game.world.setBounds(0, 0, app.game.width, app.game.height);
	app.game.kineticScrolling.stop();
	app.game.state.clearCurrentState();
	app.game.state.start('menu');
}

function fbLoad(arg) {
	var picY = 500 * scaleRatio;

	var friendGroup = app.game.add.group();

	fbFriendsArray.forEach(function(friend) {
		var butt = app.game.add.button(0, picY, 'item', challengeFn, friend);

		butt.scale.setTo(.8 * scaleRatio);
		butt.centerX = app.game.world.centerX;

		var buttPic = app.game.add.image(30, 30, friend.id + 'pic');
		var buttText = app.game.add.text(buttPic.width + 20, 30, friend.name, {
			font: 60 + 'px Baloo Paaji',
			fill: '#fff',
			align: "right",
		} );

		butt.addChild(buttText);
		butt.addChild(buttPic);

		buttPic.scale.setTo(.8);

		friendGroup.add(butt);

		picY += 200 * scaleRatio;
	});

	app.game.world.setBounds(0, 0, app.game.width, friendGroup.height + 600 * scaleRatio);

}

function challengeFn() {
	console.log('Challenged: ' + this.name);
}