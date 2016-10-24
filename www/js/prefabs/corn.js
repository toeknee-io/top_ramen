var corn = {};

corn.init = function() {

	corn.sound = pop;

	if (this.ramenId === 'tonkotsu') {

		corn.worth = 2;
		corn.bonus = 1;
		corn.type = 'good';
		corn.sound = app.level.bonus;

	} else if (this.ramenId === 'shoyu') {

		corn.worth = -1;
		corn.bonus = 0;
		corn.type = 'bad';
		corn.sound = app.level.bad;

	} else {

		corn.worth = 2;
		corn.bonus = 0;
		corn.type = 'good';

	}

	corn.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','corn.png');
	corn.sprite.scale.setTo(scaleRatio, scaleRatio);
	corn.sprite.alpha = 0;

	ings.add(corn.sprite);

	corn.spawn();

}

corn.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		corn.speed = app.game.rnd.integerInRange(1000, 1300);
	} else {
		corn.speed = app.game.rnd.integerInRange(1600, 2400);
	}

	corn.spawnTime = app.game.rnd.integerInRange(2000,5500);
	corn.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	corn.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	corn.sprite.events.onInputDown.add(collect, corn);
	
	corn.motionTween = app.game.add.tween(corn.sprite).to({ y: 50 }, corn.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	corn.fadeInTween = app.game.add.tween(corn.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	corn.rotateTween = app.game.add.tween(corn.sprite).to({ angle: 20 }, corn.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	corn.motionTween.onComplete.addOnce(destroyIng, this);

}