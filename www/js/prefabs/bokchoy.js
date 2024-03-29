var bokchoy = {};

bokchoy.init = function() {

	bokchoy.sound = app.level.pop;

	if (this.ramenId === 'shoyu') {

		bokchoy.worth = 2;
		bokchoy.bonus = 1;
		bokchoy.type = 'good';
		bokchoy.sound = app.level.bonus;

	} else {

		bokchoy.worth = 1;
		bokchoy.bonus = 0;
		bokchoy.type = 'good';

	}

	bokchoy.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet', 'bokchoy.png');
	bokchoy.sprite.scale.setTo(scaleRatio, scaleRatio);
	bokchoy.drunk = false;
	bokchoy.sprite.alpha = 0;

	ings.add(bokchoy.sprite);
	app.level.fabs.push(bokchoy);
  bokchoy.sprite.events.onInputDown.add(collect, bokchoy);

	bokchoy.spawn();

}

bokchoy.spawn = function() {

	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		bokchoy.speed = app.game.rnd.integerInRange(1000, 1200);
	} else {
		bokchoy.speed = app.game.rnd.integerInRange(2000, 3000);
	}

	bokchoy.spawnTime = app.game.rnd.integerInRange(2000,5500);
	bokchoy.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	bokchoy.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	let sheet;

	if (bokchoy.drunk === true) {

		blur = '-blur';

	} else {

		blur = '';

	}

	bokchoy.sprite.loadTexture('ings-sheet', `bokchoy${blur}.png`);
	
	bokchoy.motionTween = app.game.add.tween(bokchoy.sprite).to({ y: 50 }, bokchoy.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bokchoy.fadeInTween = app.game.add.tween(bokchoy.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	bokchoy.rotateTween = app.game.add.tween(bokchoy.sprite).to({ angle: 20 }, bokchoy.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bokchoy.motionTween.onComplete.addOnce(destroyIng, this);

}