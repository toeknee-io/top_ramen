var chicken = {};

chicken.init = function() {

	if (this.ramenId !== 'spicy_chicken') {

		chicken.worth = -3;
		chicken.bonus = 0;
		chicken.type = 'bad';

	} else {

		chicken.worth = 4;
		chicken.bonus = 3;
		chicken.type = 'good';

	}

	chicken.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet','chicken.png');
	chicken.sprite.alpha = 0;
	chicken.sprite.scale.setTo(scaleRatio, scaleRatio);
	chicken.sound = pop;

	ings.add(chicken.sprite);

	chicken.spawn();

}

chicken.spawn = function() {

	if (gameOver) {
		return;
	}

	chicken.speed = app.game.rnd.integerInRange(900,1200);
	chicken.spawnTime = app.game.rnd.integerInRange(15000,18000);
	chicken.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	chicken.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	chicken.sprite.events.onInputDown.add(collect, chicken);

	chicken.motionTween = app.game.add.tween(chicken.sprite).to({ y: 50 }, chicken.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.fadeInTween = app.game.add.tween(chicken.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.rotateTween = app.game.add.tween(chicken.sprite).to({ angle: 30 }, chicken.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.motionTween.onComplete.addOnce(destroyIng, this);
	
}