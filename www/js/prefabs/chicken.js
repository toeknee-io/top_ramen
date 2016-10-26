var chicken = {};

chicken.init = function() {

	if (this.ramenId !== 'spicy_chicken') {

		chicken.worth = -5;
		chicken.bonus = -3;
		chicken.type = 'bad';
		chicken.sound = app.level.bad;

	} else {

		chicken.worth = 4;
		chicken.bonus = 3;
		chicken.type = 'good';
		chicken.sound = app.level.bonus;

	}

	chicken.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet','chicken.png');
	chicken.sprite.alpha = 0;
	chicken.sprite.scale.setTo(scaleRatio * 1.3);
	chicken.drunk = false;

	ings.add(chicken.sprite);
	app.level.fabs.push(chicken);

	chicken.spawn();

}

chicken.spawn = function() {

	if (gameOver) {
		return;
	}

	chicken.speed = app.game.rnd.integerInRange(1000,1500);
	chicken.spawnTime = app.game.rnd.integerInRange(15000,18000);
	chicken.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	chicken.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	chicken.sprite.events.onInputDown.add(collect, chicken);

	let sheet;

	if (chicken.drunk === true) {

		sheet = 'ings-sheet-blur';

	} else {

		sheet = 'ings-sheet';

	}

	chicken.sprite.loadTexture(sheet, 'chicken.png');

	chicken.motionTween = app.game.add.tween(chicken.sprite).to({ y: 50 }, chicken.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.fadeInTween = app.game.add.tween(chicken.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.rotateTween = app.game.add.tween(chicken.sprite).to({ angle: 30 }, chicken.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.motionTween.onComplete.addOnce(destroyIng, this);
	
}