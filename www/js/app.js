'use strict';

window.app = {
	program_name: "Top Ramen",
	game: new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'play_area')
};

window.scaleRatio = window.devicePixelRatio / 3.5;
console.log('Device Pixel Ratio: ' + window.devicePixelRatio);