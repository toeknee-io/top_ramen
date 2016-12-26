var mushroom = {};

mushroom.init = function() {

	mushroom.sound = app.level.pop;

	if (this.ramenId !== 'spicy_chicken') {

		mushroom.worth = 2;
		mushroom.bonus = 0;

	} else {

		mushroom.worth = 2;
		mushroom.bonus = 1;
		mushroom.sound = app.level.bonus;

	}

	mushroom.type = 'good';
	mushroom.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(app.game.world.height * .70,app.game.world.height * .50),'ings-sheet', 'mushroom.png');
	mushroom.sprite.alpha = 0;
	mushroom.sprite.scale.setTo(scaleRatio, scaleRatio);
	mushroom.drunk = false;

	ings.add(mushroom.sprite);
	app.level.fabs.push(mushroom);
	mushroom.sprite.events.onInputDown.add(collect, mushroom);

	mushroom.spawn();

}

mushroom.spawn = function() {

	if (gameOver) {
		return;
	}

	mushroom.speed = app.game.rnd.integerInRange(1000,2500);
	mushroom.spawnTime = app.game.rnd.integerInRange(15000,18000);
	mushroom.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	mushroom.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);

	let sheet;

	if (mushroom.drunk === true) {

		blur = '-blur';

  } else {

    blur = '';

  }

	mushroom.sprite.loadTexture('ings-sheet', `mushroom${blur}.png`);

	mushroom.motionTween = app.game.add.tween(mushroom.sprite).to({ y: app.game.world.height * .20 }, mushroom.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	mushroom.fadeInTween = app.game.add.tween(mushroom.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	mushroom.rotateTween = app.game.add.tween(mushroom.sprite).to({ angle: 30 }, mushroom.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	mushroom.motionTween.onComplete.addOnce(destroyIng, this);

}
