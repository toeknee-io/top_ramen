app.challenge = {}

var fbData;
var xhr = new XMLHttpRequest();

app.challenge.preload = function() {
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	app.game.load.image('home', 'assets/home.png');

	var bg = app.game.add.image(0,0,'menu_bg');
	bg.scale.setTo(scaleRatio*2.05);
}

app.challenge.create = function() {
	console.log('Challenge State');

	var homeButton = app.game.add.button(0,0,'home', goHome);
	homeButton.scale.setTo(scaleRatio);

	xhr.open("GET", "http://www.toeknee.io:3000/explorer/#!/user/user_prototype_get_identities", false);

}

function goHome() {
	app.game.state.start('menu');
}