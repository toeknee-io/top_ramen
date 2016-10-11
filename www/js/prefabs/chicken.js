var chicken = {};

chicken.worth = 4;
chicken.bonus = 3;

chicken.spawn = function() {
	if (gameOver) {
		return;
	}
	chicken.speed = app.game.rnd.integerInRange(600,750);
	chicken.spawnTime = app.game.rnd.integerInRange(15000,18000);
	chicken.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet','chicken.png');
	ings.add(chicken.sprite);
	chicken.sprite.alpha = 0;
	chicken.sprite.scale.setTo(scaleRatio, scaleRatio);
	chicken.sprite.events.onInputDown.add(collect, chicken);
	chicken.motionTween = app.game.add.tween(chicken.sprite).to({ y: app.game.world.height * .20 }, chicken.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.fadeInTween = app.game.add.tween(chicken.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	chicken.motionTween.onComplete.addOnce(killIng, this);

	chicken.sound = pop;
}