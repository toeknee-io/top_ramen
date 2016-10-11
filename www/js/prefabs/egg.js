var egg = {};

egg.worth = 2;
egg.bonus = 2;

egg.spawn = function() {
	if (gameOver) {
		return;
	}
	egg.speed = app.game.rnd.integerInRange(600,750);
	egg.spawnTime = app.game.rnd.integerInRange(7000,12000);
	egg.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet','egg.png');
	ings.add(egg.sprite);
	egg.sprite.alpha = 0;
	egg.sprite.scale.setTo(scaleRatio, scaleRatio);
	egg.sprite.events.onInputDown.add(collect, egg);
	egg.motionTween = app.game.add.tween(egg.sprite).to({ y: app.game.world.height * .20 }, egg.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	egg.fadeInTween = app.game.add.tween(egg.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	egg.motionTween.onComplete.addOnce(killIng, this);

	egg.sound = pop;
}