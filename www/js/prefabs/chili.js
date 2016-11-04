var chili = {};

chili.init = function() {

	chili.sound = app.level.pop;

	if (this.ramenId !== 'tonkotsu') {

		chili.worth = 1;
		chili.bonus = 0;
		chili.type = 'good';

	} else {

		chili.worth = -2;
		chili.bonus = 0;
		chili.type = 'bad';
		chili.sound = app.level.bad;

	}

	chili.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet', 'chili.png');
	chili.sprite.alpha = 0;
	chili.sprite.scale.setTo(scaleRatio, scaleRatio);
	chili.drunk = false;

	ings.add(chili.sprite);
	app.level.fabs.push(chili);

	chili.spawn();

}

chili.spawn = function() {
	if (gameOver) {
		return;
	}

	if (timeLeft < 20) {
		chili.speed = app.game.rnd.integerInRange(1000, 1300);
	} else {
		chili.speed = app.game.rnd.integerInRange(1600, 2400);
	}

	chili.spawnTime = app.game.rnd.integerInRange(4000,6000);
	chili.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	chili.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	chili.sprite.events.onInputDown.add(collect, chili);

	let sheet;

	if (chili.drunk === true) {

		blur = '-blur';

  } else {

    blur = '';

  }

	chili.sprite.loadTexture('ings-sheet', `chili${blur}.png`);

	chili.motionTween = app.game.add.tween(chili.sprite).to({ y: 50 }, chili.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chili.fadeInTween = app.game.add.tween(chili.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	chili.rotateTween = app.game.add.tween(chili.sprite).to({ angle: -20 }, chili.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chili.motionTween.onComplete.addOnce(destroyIng, this);
}