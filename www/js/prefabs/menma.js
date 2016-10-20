var menma = {};

menma.init = function() {

	if (this.ramenId !== 'spicy_chicken') {

		menma.worth = 2;
		menma.bonus = 0;
		menma.type = 'good';

	} else {

		menma.worth = -1;
		menma.bonus = 0;
		menma.type = 'bad';

	}

	menma.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','menma.png');
	menma.sprite.scale.setTo(scaleRatio, scaleRatio);
	menma.sprite.alpha = 0;
	menma.sound = pop;

	ings.add(menma.sprite);

	menma.spawn();

}

menma.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		menma.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		menma.speed = app.game.rnd.integerInRange(1000, 2000);
	}

	menma.spawnTime = app.game.rnd.integerInRange(2000,5500);
	menma.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	menma.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	menma.sprite.events.onInputDown.add(collect, menma);
	
	menma.motionTween = app.game.add.tween(menma.sprite).to({ y: 50 }, menma.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	menma.fadeInTween = app.game.add.tween(menma.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	menma.rotateTween = app.game.add.tween(menma.sprite).to({ angle: 20 }, menma.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	menma.motionTween.onComplete.addOnce(destroyIng, this);

}