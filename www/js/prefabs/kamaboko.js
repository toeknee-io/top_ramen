var kamaboko = {};

kamaboko.init = function() {

	kamaboko.worth = 4;
	kamaboko.bonus = 2;
	kamaboko.type = 'good';
	kamaboko.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet', 'kamaboko.png');
	kamaboko.sprite.alpha = 0;
	kamaboko.sprite.scale.setTo(scaleRatio * 1.5);
	kamaboko.sound = app.level.bonus;
	kamaboko.drunk = false;

	ings.add(kamaboko.sprite);
	app.level.fabs.push(kamaboko);
	kamaboko.sprite.events.onInputDown.add(collect, kamaboko);

	kamaboko.spawn();

}

kamaboko.spawn = function() {
	if (gameOver) {
		return;
	}
	kamaboko.speed = app.game.rnd.integerInRange(900,1350);
	kamaboko.spawnTime = app.game.rnd.integerInRange(7000,12000);
	kamaboko.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	kamaboko.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	let sheet;

	if (kamaboko.drunk === true) {

		blur = '-blur';

  } else {

    blur = '';

  }

	kamaboko.sprite.loadTexture('ings-sheet', `kamaboko${blur}.png`);

	kamaboko.motionTween = app.game.add.tween(kamaboko.sprite).to({ y: app.game.world.height * .20 }, kamaboko.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	kamaboko.fadeInTween = app.game.add.tween(kamaboko.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	kamaboko.rotateTween = app.game.add.tween(kamaboko.sprite).to({ angle: -30 }, kamaboko.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	kamaboko.motionTween.onComplete.addOnce(destroyIng, this);
}
