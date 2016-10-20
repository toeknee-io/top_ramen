var bokchoy = {};

bokchoy.init = function() {

	if (this.ramenId !== 'tonkotsu') {

		bokchoy.worth = 2;
		bokchoy.bonus = 0;
		bokchoy.type = 'good';

	} else {

		bokchoy.worth = -1;
		bokchoy.bonus = 0;
		bokchoy.type = 'bad';

	}

	bokchoy.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','bokchoy.png');
	bokchoy.sprite.scale.setTo(scaleRatio, scaleRatio);
	bokchoy.sprite.alpha = 0;
	bokchoy.sound = pop;

	ings.add(bokchoy.sprite);

	bokchoy.spawn();

}

bokchoy.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		bokchoy.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		bokchoy.speed = app.game.rnd.integerInRange(1000, 2000);
	}

	bokchoy.spawnTime = app.game.rnd.integerInRange(2000,5500);
	bokchoy.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	bokchoy.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	bokchoy.sprite.events.onInputDown.add(collect, bokchoy);
	
	bokchoy.motionTween = app.game.add.tween(bokchoy.sprite).to({ y: 50 }, bokchoy.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bokchoy.fadeInTween = app.game.add.tween(bokchoy.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	bokchoy.rotateTween = app.game.add.tween(bokchoy.sprite).to({ angle: 20 }, bokchoy.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bokchoy.motionTween.onComplete.addOnce(destroyIng, this);

}