var bug = {};

bug.worth = -1;
bug.bonus = 0;

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
	bug.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'ings-sheet','bug.png');
	ings.add(bug.sprite);
	bug.sprite.alpha = 0;
	bug.sprite.scale.setTo(scaleRatio, scaleRatio);
	bug.sprite.events.onInputDown.add(collect, bug);
	bug.motionTween = app.game.add.tween(bug.sprite).to({ y: 50 }, bug.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bug.fadeInTween = app.game.add.tween(bug.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	bug.rotateTween = app.game.add.tween(bug.sprite).to({ angle: -30 }, bug.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	bug.motionTween.onComplete.addOnce(killIng, this);

	bug.sound = pop;
}