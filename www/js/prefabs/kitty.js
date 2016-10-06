var kitty = {};

kitty.worth = -2;
kitty.bonus = 0;

var kittyColor;

kitty.spawn = function() {
	if (gameOver) {
		return;
	}
	var random = app.game.rnd.integerInRange(0,10);
	if (random > 5) {
		kittyColor = '-brown';
	} else {
		kittyColor = '';
	}
	kitty.speed = app.game.rnd.integerInRange(900,1300);
	kitty.spawnTime = app.game.rnd.integerInRange(5000,10000);
	kitty.sprite = app.game.add.image(app.game.rnd.integerInRange(leftBounds,rightBounds),app.game.rnd.integerInRange(topBounds,bottomBounds),'spritesheet','kitty' + kittyColor + '.png');
	ings.add(kitty.sprite);
	kitty.sprite.alpha = 0;
	kitty.sprite.scale.setTo(scaleRatio, scaleRatio);
	kitty.sprite.events.onInputDown.add(collect, kitty);
	kitty.motionTween = app.game.add.tween(kitty.sprite).to({ y: 50 }, kitty.speed, Phaser.Easing.easeIn, true, 0, 0, false);
	kitty.fadeInTween = app.game.add.tween(kitty.sprite).to({ alpha: 1 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);
	kitty.motionTween.onComplete.addOnce(killIng, this);

	kitty.sound = pop;
}