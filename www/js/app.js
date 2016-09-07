var app = {
	program_name: "Top Ramen",
	game: new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'play_area')
}

//window.innerWidth * window.devicePixelRatio
//window.innerHeight * window.devicePixelRatio
var scaleRatio = window.devicePixelRatio / 3;