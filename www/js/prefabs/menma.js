var menma = {};

menma.init = function() {

	menma.sound = app.level.pop;

	if (this.ramenId !== 'spicy_chicken') {

		menma.worth = 1;
		menma.bonus = 0;
		menma.type = 'good';

	} else {

		menma.worth = -2;
		menma.bonus = 0;
		menma.type = 'bad';
		menma.sound = app.level.bad;

	}

	menma.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet', 'menma.png');
	menma.sprite.scale.setTo(scaleRatio, scaleRatio);
	menma.sprite.alpha = 0;
	menma.drunk = false;

	ings.add(menma.sprite);
	app.level.fabs.push(menma);

	menma.spawn();

}

menma.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		menma.speed = app.game.rnd.integerInRange(1000, 1400);
	} else {
		menma.speed = app.game.rnd.integerInRange(1600, 2400);
	}

	menma.spawnTime = app.game.rnd.integerInRange(2000,5500);
	menma.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	menma.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	menma.sprite.events.onInputDown.add(collect, menma);

	let sheet;

	if (menma.drunk === true) {

		blur = '-blur';

  } else {

    blur = '';

  }

	menma.sprite.loadTexture('ings-sheet', `menma${blur}.png`);
	
	menma.motionTween = app.game.add.tween(menma.sprite).to({ y: 50 }, menma.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	menma.fadeInTween = app.game.add.tween(menma.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	menma.rotateTween = app.game.add.tween(menma.sprite).to({ angle: 20 }, menma.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	menma.motionTween.onComplete.addOnce(destroyIng, this);

}