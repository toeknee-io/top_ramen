var sprouts = {};

sprouts.init = function() {

	if (this.ramenId === 'tonkotsu') {

		sprouts.worth = 2;
		sprouts.bonus = 0;
		sprouts.type = 'good';

	} else {

		sprouts.worth = -1;
		sprouts.bonus = 0;
		sprouts.type = 'bad';

	}

	sprouts.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','sprouts.png');
	sprouts.sprite.scale.setTo(scaleRatio, scaleRatio);
	sprouts.sprite.alpha = 0;
	sprouts.sound = pop;

	ings.add(sprouts.sprite);

	sprouts.spawn();

}

sprouts.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		sprouts.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		sprouts.speed = app.game.rnd.integerInRange(1000, 2000);
	}

	sprouts.spawnTime = app.game.rnd.integerInRange(2000,5500);
	sprouts.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	sprouts.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	sprouts.sprite.events.onInputDown.add(collect, sprouts);
	
	sprouts.motionTween = app.game.add.tween(sprouts.sprite).to({ y: 50 }, sprouts.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	sprouts.fadeInTween = app.game.add.tween(sprouts.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	sprouts.rotateTween = app.game.add.tween(sprouts.sprite).to({ angle: 20 }, sprouts.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	sprouts.motionTween.onComplete.addOnce(destroyIng, this);

}