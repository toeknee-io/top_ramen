var noodles = {};

noodles.init = function() {

	noodles.worth = 1;
	noodles.bonus = 0;
	noodles.type = 'good';
	//noodles.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','noodles.png');
	noodles.sprite.scale.setTo(scaleRatio, scaleRatio);
	noodles.sprite.alpha = 0;
	noodles.sound = pop;

	ings.add(noodles.sprite);

	noodles.spawn();

}

noodles.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		noodles.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		noodles.speed = app.game.rnd.integerInRange(1000, 2000);
	}

	noodles.spawnTime = app.game.rnd.integerInRange(1000,5000);
	noodles.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	noodles.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	noodles.sprite.events.onInputDown.add(collect, noodles);
	
	noodles.motionTween = app.game.add.tween(noodles.sprite).to({ y: 50 }, noodles.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	noodles.fadeInTween = app.game.add.tween(noodles.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	noodles.rotateTween = app.game.add.tween(noodles.sprite).to({ angle: 20 }, noodles.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	noodles.motionTween.onComplete.addOnce(destroyIng, this);

}