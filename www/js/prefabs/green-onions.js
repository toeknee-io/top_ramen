var greenOnions = {};

greenOnions.worth = 1;
greenOnions.bonus = 0;
greenOnions.type = 'good';

greenOnions.spawn = function() {
	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		greenOnions.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		greenOnions.speed = app.game.rnd.integerInRange(1000, 2000);
	}

	greenOnions.spawnTime = app.game.rnd.integerInRange(2200,5000);
	greenOnions.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','green-onions.png');
	greenOnions.sprite.alpha = 0;
	greenOnions.sprite.scale.setTo(scaleRatio, scaleRatio);
	ings.add(greenOnions.sprite);
	greenOnions.sprite.events.onInputDown.add(collect, greenOnions);
	greenOnions.motionTween = app.game.add.tween(greenOnions.sprite).to({ y: 50 }, greenOnions.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	greenOnions.fadeInTween = app.game.add.tween(greenOnions.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	greenOnions.rotateTween = app.game.add.tween(greenOnions.sprite).to({ angle: 20 }, greenOnions.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	greenOnions.motionTween.onComplete.addOnce(killIng, this);

	greenOnions.sound = pop;
}

greenOnions.fadeOutTween = function() {
	app.game.add.tween(greenOnions.sprite).to({ alpha: 0 }, 100, Phaser.Easing.easeIn, true, 0, 0, false);
}