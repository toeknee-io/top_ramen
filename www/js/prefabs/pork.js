var pork = {};

pork.init = function() {

	pork.sound = app.level.bad;

	if (this.ramenId !== 'spicy_chicken') {

		pork.worth = 4;
		pork.bonus = 3;
		pork.type = 'good';
		pork.sound = app.level.bonus;

	} else {

		pork.worth = -3;
		pork.bonus = 0;
		pork.type = 'bad';

	}

	pork.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet','pork.png');
	pork.sprite.alpha = 0;
	pork.sprite.scale.setTo(scaleRatio * 1.3);

	ings.add(pork.sprite);

	pork.spawn();

}

pork.spawn = function() {

	if (gameOver) {
		return;
	}

	pork.speed = app.game.rnd.integerInRange(1000,1500);
	pork.spawnTime = app.game.rnd.integerInRange(15000,18000);
	pork.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	pork.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	pork.sprite.events.onInputDown.add(collect, pork);

	pork.motionTween = app.game.add.tween(pork.sprite).to({ y: 50 }, pork.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	pork.fadeInTween = app.game.add.tween(pork.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	pork.rotateTween = app.game.add.tween(pork.sprite).to({ angle: 30 }, pork.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	pork.motionTween.onComplete.addOnce(destroyIng, this);
	
}