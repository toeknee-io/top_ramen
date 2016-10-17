'use strict';

window.app = {
	program_name: "Top Ramen",
	game: new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'play_area'),
  __prevState: null
};

//window.innerWidth * window.devicePixelRatio
//window.innerHeight * window.devicePixelRatio
window.scaleRatio = window.devicePixelRatio / 3;