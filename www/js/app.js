window.app = {
  program_name: 'Top Ramen',
  game: new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'play_area'),
};

if (window.devicePixelRatio > 3) {
  window.scaleRatio = window.devicePixelRatio / 3;
} else {
  window.scaleRatio = window.devicePixelRatio / 3.5;
}

window.console.log(`Device Pixel Ratio: ${window.devicePixelRatio}`);
