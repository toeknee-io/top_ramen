var kitty = {};

kitty.init = function() {

	let random = app.game.rnd.integerInRange(0,10);
	let kittyColor;

	if (random > 5) {
		kittyColor = '-brown';
	} else {
		kittyColor = '';
	}

	kitty.worth = -4;
	kitty.bonus = 0;
	kitty.type = 'bad';
	kitty.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','kitty' + kittyColor + '.png');
	kitty.sprite.alpha = 0;
	kitty.sprite.scale.setTo(scaleRatio * 1.3);
	kitty.sound = app.game.add.audio('cat', 0.5);
	kitty.drunk = false;

	ings.add(kitty.sprite);
	app.level.fabs.push(kitty);

	kitty.spawn();

}

kitty.spawn = function() {

	if (gameOver) {
		return;
	}

	let random = app.game.rnd.integerInRange(0,10);
	let kittyColor;

	if (random > 5) {
		kittyColor = '-brown';
	} else {
		kittyColor = '';
	}
	
	kitty.speed = app.game.rnd.integerInRange(1300,1600);
	kitty.spawnTime = app.game.rnd.integerInRange(5000,10000);
	kitty.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	kitty.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	kitty.sprite.events.onInputDown.add(collect, kitty);

	let sheet;

	if (kitty.drunk === true) {

		sheet = 'ings-sheet-blur';

	} else {

		sheet = 'ings-sheet';

	}

	kitty.sprite.loadTexture(sheet, 'kitty' + kittyColor + '.png');

	kitty.motionTween = app.game.add.tween(kitty.sprite).to({ y: 50 }, kitty.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	kitty.fadeInTween = app.game.add.tween(kitty.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	kitty.rotateTween = app.game.add.tween(kitty.sprite).to({ angle: 30 }, kitty.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	kitty.motionTween.onComplete.addOnce(destroyIng, this);
}