var chili = {};

chili.worth = 1;
chili.bonus = 0;

chili.spawn = function() {
	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		chili.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		chili.speed = app.game.rnd.integerInRange(1000, 2000);
	}

	chili.spawnTime = app.game.rnd.integerInRange(4000,6000);
	chili.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'spritesheet','chili.png');
	chili.sprite.alpha = 0;
	chili.sprite.scale.setTo(scaleRatio, scaleRatio);
	ings.add(chili.sprite);
	chili.sprite.events.onInputDown.add(collect, chili);
	chili.motionTween = app.game.add.tween(chili.sprite).to({ y: 50 }, chili.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chili.fadeInTween = app.game.add.tween(chili.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	chili.motionTween.onComplete.addOnce(killIng, this);

	chili.sound = pop;
}

chili.fadeOutTween = function() {
	app.game.add.tween(chili.sprite).to({ alpha: 0 }, 100, Phaser.Easing.easeIn, true, 0, 0, false);
}