app.challenge = {}

var friendsArray;
var friendButton;

app.challenge.preload = function() {
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	app.game.kineticScrolling = app.game.plugins.add(Phaser.Plugin.KineticScrolling);

	app.game.kineticScrolling.configure({
	    kineticMovement: true,
	    timeConstantScroll: 325,
	    horizontalScroll: false,
	    verticalScroll: true,
	    horizontalWheel: false,
	    verticalWheel: true,
	    deltaWheel: 40
	});

	app.game.load.image('userPic', userPic);
	app.game.load.image('home', 'assets/home.png');

	var bg = app.game.add.image(0,0,'menu_bg');
	bg.scale.setTo(scaleRatio*2.05);

	console.log(userFriends.responseJSON.data);

	friendsArray = userFriends.responseJSON.data;
	friendsArray.forEach(function(friend) {
		console.log(friend.id);
		console.log('https://graph.facebook.com/'+friend.id+'/picture');
		var friendPic = 'https://graph.facebook.com/'+friend.id+'/picture?type=large';
		app.game.load.image(friend.id+'pic', friendPic);
	});

}

app.challenge.create = function() {
	console.log('Challenge State');

	var homeButton = app.game.add.button(0,0,'home', goHome);
	homeButton.scale.setTo(scaleRatio);

	fbLoad(friendsArray);

}

function goHome() {
	app.game.state.start('menu');
}

function fbLoad(arg) {
	app.game.add.image(0,60,'userPic').scale.setTo(scaleRatio);

	var picY = 180;

	for (i = 0; i < 15; i++) {
		friendsArray.push({
			id: '10210893959372000',
			name: 'Tny ' + i
		});
	}

	friendsArray.forEach(function(friend) {
		var butt = app.game.add.button(0,picY,friend.id+'pic', function() {
			console.log('Challenged: ' + friend.name);
		});

		butt.scale.setTo(.80*scaleRatio);

		var buttText = app.game.add.text( 200, 0, friend.name, {
			font: 200 * scaleRatio + 'px Baloo Paaji',
			fill: '#444',
			align: "left",
		} );

		butt.addChild(buttText);

		picY += 60;
	});

	app.game.kineticScrolling.start();
}