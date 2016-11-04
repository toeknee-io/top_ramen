var sake = {};

sake.init = function() {

	sake.worth = 0;
	sake.bonus = 0;
	sake.type = '';
	sake.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds, rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds), 'ings-sheet', 'sake.png');
	sake.sprite.scale.setTo(scaleRatio * 1.3);
	sake.sprite.alpha = 0;
	sake.sound = app.game.add.audio('sake');
	sake.text = app.game.add.bitmapText(app.game.world.centerX , 400, 'fnt', 'sake bomb!');
	sake.text.scale.setTo(scaleRatio * 6);
	sake.text.anchor.x = .5;
	sake.text.alpha = 0;

	ings.add(sake.sprite);

	sake.spawn();

}

sake.spawn = function() {

	if (gameOver) {
		return;
	}

	/*if (timeLeft < 20) {
		sake.speed = app.game.rnd.integerInRange(700, 1000);
	} else {
		sake.speed = app.game.rnd.integerInRange(1000, 2000);
	}*/

	sake.speed = app.game.rnd.integerInRange(1000, 2000);
	sake.spawnTime = app.game.rnd.integerInRange(10000, 25000);
	sake.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	sake.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	sake.sprite.events.onInputDown.add(collect, sake);
	
	sake.motionTween = app.game.add.tween(sake.sprite).to({ y: 50 }, sake.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	sake.fadeInTween = app.game.add.tween(sake.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	//sake.rotateTween = app.game.add.tween(sake.sprite).to({ angle: 20 }, sake.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	sake.motionTween.onComplete.addOnce(destroyIng, this);

}