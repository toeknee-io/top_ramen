var bug = {};

bug.init = function() {

	bug.worth = -2;
	bug.bonus = 0;
	bug.type = 'bad';
	bug.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','bug.png');
	bug.sprite.alpha = 0;
	bug.sprite.scale.setTo(scaleRatio, scaleRatio);
	bug.drunk = false
	bug.sound = app.level.bug;

	ings.add(bug.sprite);
	app.level.fabs.push(bug);

	bug.spawn();

}

bug.spawn = function() {
	if (gameOver) {
		return;
	}

	if (timeLeft < 30) {
		bug.spawnTime = app.game.rnd.integerInRange(1300,3500);
	} else {
		bug.spawnTime = app.game.rnd.integerInRange(1300,5700);
	}

	bug.speed = app.game.rnd.integerInRange(900, 1300);
	bug.sprite.x = app.game.rnd.integerInRange(leftBounds, rightBounds);
	bug.sprite.y = app.game.rnd.integerInRange(topBounds,bottomBounds);
	
	bug.sprite.events.onInputDown.add(collect, bug);

	let sheet;

	if (bug.drunk === true) {

		sheet = 'ings-sheet-blur';

	} else {

		sheet = 'ings-sheet';

	}

	bug.sprite.loadTexture(sheet, 'bug.png');
	
	bug.motionTween = app.game.add.tween(bug.sprite).to({ y: 50 }, bug.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bug.fadeInTween = app.game.add.tween(bug.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	bug.rotateTween = app.game.add.tween(bug.sprite).to({ angle: -30 }, bug.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bug.motionTween.onComplete.addOnce(destroyIng, this);

}