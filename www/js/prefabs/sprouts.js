var sprouts = {};

sprouts.init = function() {

	sprouts.worth = 1;
	sprouts.bonus = 0;
	sprouts.type = 'good';

	sprouts.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','sprouts.png');
	sprouts.sprite.scale.setTo(scaleRatio, scaleRatio);
	sprouts.sprite.alpha = 0;
	sprouts.sound = app.level.pop;
	sprouts.drunk = false;

	ings.add(sprouts.sprite);
	app.level.fabs.push(sprouts);
	sprouts.sprite.events.onInputDown.add(collect, sprouts);

	sprouts.spawn();

}

sprouts.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		sprouts.speed = app.game.rnd.integerInRange(1000, 1400);
	} else {
		sprouts.speed = app.game.rnd.integerInRange(1600, 2400);
	}

	sprouts.spawnTime = app.game.rnd.integerInRange(2000,5500);
	sprouts.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	sprouts.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	let sheet;

	if (sprouts.drunk === true) {

		blur = '-blur';

  } else {

    blur = '';

  }

	sprouts.sprite.loadTexture('ings-sheet', `sprouts${blur}.png`);

	sprouts.motionTween = app.game.add.tween(sprouts.sprite).to({ y: 50 }, sprouts.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	sprouts.fadeInTween = app.game.add.tween(sprouts.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	sprouts.rotateTween = app.game.add.tween(sprouts.sprite).to({ angle: 20 }, sprouts.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	sprouts.motionTween.onComplete.addOnce(destroyIng, this);

}
