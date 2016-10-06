app.level = {};

var score;
var scoreText;
var goodText;
var bonusText;
var bonusFadeIn;
var bonusFadeOut;
var gameTimer;
var bonusTimer;
var timeLeft;
var bonusTime;
var bonus;
var gameOver;

var pop;

var leftBounds;
var rightBounds;
var topBounds;
var bottomBounds;

var imageSize = '';

var emitter;
var steamEmitter;

// Groups
var ings;

app.level.init = function(challengeId) {

	app.level.challengeId = false;

	if (challengeId) {
		app.level.challengeId = challengeId;
	}
	
}

app.level.preload = function() {
	console.log('Level Sate');

	app.game.world.setBounds(0, 0, app.game.width, app.game.height);
	app.game.kineticScrolling.stop();
    
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	if (!imageSize) imageSize = '';
    
	if (window.devicePixelRatio == 2) {
		imageSize = 'X2';
	} else if (window.devicePixelRatio >= 3) {
		imageSize = 'LG';
	}

	// Level Assets
	// Make spritesheet
	app.game.load.image('bg', 'assets/bg' + imageSize + '.jpg');
	app.game.load.image('bowl', 'assets/bowl' + imageSize + '.png');
	app.game.load.image('splash', 'assets/splash.png');
	app.game.load.image('steam', 'assets/steam.png');
	app.game.load.image('lights', 'assets/top-lights' + imageSize + '.png');
	app.game.load.image('dot1', 'assets/dot1.png');
	app.game.load.image('dot2', 'assets/dot2.png');
	app.game.load.image('dot3', 'assets/dot3.png');
	app.game.load.image('cutting-board', 'assets/cutting-board.png');
	app.game.load.atlasJSONHash('spritesheet', 'assets/spritesheet.png', 'assets/spritesheet.json');

	app.game.load.bitmapFont('8bit', 'assets/fonts/8bit.png', 'assets/fonts/8bit.fnt' );

	leftBounds = app.game.world.width * .17;
	rightBounds = app.game.world.width * .83;
	topBounds = app.game.world.height * .50;
	bottomBounds = app.game.world.height * .80;

}

app.level.create = function() {

	timeLeft = 60;
	score = 0;
	bonusTime = 0;
	bonus = false;
	gameOver = false;

	// Groups
	ings = app.game.add.group();
	ings.inputEnableChildren = true;

	// Timer to call end of game
	app.game.time.events.add(60000, time, this);

	// Timer for countdown
	gameTimer = app.game.time.create(false);
	gameTimer.loop(1000, updateTimer, this);
	gameTimer.start();

	// Set up Background
	var bg = app.game.add.image(0,0, 'bg');
	bg.x = app.game.width/2 - bg.width/2;
	bg.moveDown();

	var dot1 = app.game.add.sprite(0,0,'dot1');
	var dot2 = app.game.add.sprite(app.game.world.width,200,'dot2');
	var dot3 = app.game.add.sprite(0,app.game.world.height,'dot3');

	var dotGroup = app.game.add.group();

	dotGroup.add(dot1);
	dotGroup.add(dot2);
	dotGroup.add(dot3);

	app.game.physics.arcade.enable(dotGroup);

	dotGroup.forEach(setupDots,this,true);

	function setupDots(child) {
		child.scale.setTo(scaleRatio,scaleRatio);
		child.body.velocity.setTo(30, 40);
    	child.body.bounce.set(1);
    	child.body.collideWorldBounds = true;
	}

    // Set up cutting board
	var cutting = app.game.add.image(app.game.world.centerX,app.game.world.centerY,'cutting-board');
	cutting.scale.setTo(scaleRatio*1.7, scaleRatio*1.7);
	cutting.anchor.x = 0.5;
	cutting.anchor.y = 0.5;

	app.game.world.bringToTop(ings);

	// Set up top light bar
	var lights = app.game.add.sprite(0, 0 - 30 * scaleRatio, 'lights');
	lights.x = app.game.width/2 - lights.width/2;

	// Set up bottom wooden board
	var board = app.game.add.image(0 - 40 * scaleRatio,app.game.height - 200 * scaleRatio, 'spritesheet', 'board.png');
	board.scale.setTo(scaleRatio, scaleRatio);

	// Set up bowl
	var bowl = app.game.add.image(0,0,'bowl');
	//bowl.scale.setTo(scaleRatio, scaleRatio);
	bowl.x = app.game.width/2 - bowl.width/2;
	bowl.y = app.game.height - 10 - bowl.height;

	// Audio
	pop = app.game.add.audio('pop');
	//var lvlSong = app.game.add.audio('lvl');
	//lvlSong.play();

	// Score text
	scoreText = app.game.add.text(39 * scaleRatio,30 * scaleRatio,'Score \n 0',{
		font: 66 * scaleRatio + 'px Baloo Paaji',
		fill: '#eee',
		align: "center",
	});

	// Time left text
	timeLeftText = app.game.add.text(app.game.world.centerX,51 * scaleRatio,'60',{
		font: 96 * scaleRatio + 'px Baloo Paaji',
		fill: '#fff'
	});
	timeLeftText.anchor.x = 0.5;

	// Splash
	emitter = app.game.add.emitter(0,0,30);
	emitter.makeParticles('splash');
    emitter.gravity = 500;

    // Steam
    steamEmitter = app.game.add.emitter(app.game.world.centerX,10,300);
    steamEmitter.makeParticles('steam');
    steamEmitter.gravity = -500;
    steamEmitter.setRotation(0.1, 0.1);
    steamEmitter.setAlpha(0, .4, 10000);
    steamEmitter.setScale(0.2, .4, 0.2, .7, 4000, Phaser.Easing.easeOut);
    steamEmitter.start(false,500,20);
    steamEmitter.forEachAlive(function(p) {
    	p.scale.setTo(scaleRatio,scaleRatio);
    });
    steamEmitter.emitX = bowl.x + bowl.width/2;
    steamEmitter.emitY = bowl.y + 20;

    // Collect Text FIX
    bonusText = app.game.add.bitmapText(0, app.game.rnd.integerInRange(40,300), '8bit', 'BONUS!');
    bonusText.scale.setTo(window.devicePixelRatio * 2);
	bonusText.x = app.game.world.centerX - bonusText.width/2;
	bonusText.alpha = 0;
	bonusFadeIn = app.game.add.tween(bonusText).to({ alpha: 1 }, 150, Phaser.Easing.easeIn, true, 0, 0, false);
	bonusFadeOut = app.game.add.tween(bonusText).to({ alpha: 0 }, 400, Phaser.Easing.easeIn, true, 0, 0, false);
	bonusFadeIn.chain(bonusFadeOut);

	goodText = app.game.add.bitmapText(0, app.game.rnd.integerInRange(40,300), '8bit', 'GOOD');
    goodText.scale.setTo(window.devicePixelRatio);
	goodText.x = app.game.world.centerX - goodText.width/2;
	goodText.alpha = 0;
	goodFadeIn = app.game.add.tween(goodText).to({ alpha: 1 }, 150, Phaser.Easing.easeIn, true, 0, 0, false);
	goodFadeOut = app.game.add.tween(goodText).to({ alpha: 0 }, 400, Phaser.Easing.easeIn, true, 0, 0, false);
	goodFadeIn.chain(goodFadeOut);

	// FIGURE OUT WHY THEY STACK UP

	// Introduce Noodles
	noodles.spawn();

	// Introduce Green Onions
	app.game.time.events.add(2000, greenOnions.spawn, greenOnions);

	// Introduce Chili Powder
	app.game.time.events.add(app.game.rnd.integerInRange(3000,6000), chili.spawn, chili);

	// Introduce Egg
	app.game.time.events.add(12000, egg.spawn, egg);

	// Introduce Chicken
	app.game.time.events.add(app.game.rnd.integerInRange(20000,25000), chicken.spawn, chicken);

	// Introduce Bug
	app.game.time.events.add(15000, bug.spawn, bug);

	// Introduce Kitty
	app.game.time.events.add(20000, kitty.spawn, kitty);
}

app.level.update = function() {

	scoreText.text = 'Score\n' + score;
	timeLeftText.text = timeLeft;
}

// Countdown timer update
function updateTimer() {
	if (!gameOver) {
		timeLeft--;
	}
}

// Called after initial 60 seconds
function time() {
	gameTimer.stop();
	timeLeft = 0;
	if (bonusTime > 0) {
		bonus = true;
		timeLeft = bonusTime;
		bonusTimer = app.game.time.create(false);
		bonusTimer.loop(1000, updateTimer, this);
		bonusTimer.start();
		app.game.time.events.add(bonusTime * 1000, endGame, this);
		console.log("Bonus Time");
	} else {
		endGame();
	}
}

// Collect (tap) ingredients
function collect(ingredient) {
	collectSound(this);

	if("vibrate" in window.navigator) {
	    window.navigator.vibrate(50);
	}

	if (this.bonus == 0 && this.worth > 0 && goodFadeOut.isRunning == false) {
		goodFadeIn.start();
		goodText.y = app.game.rnd.integerInRange(app.game.world.y + 100, app.game.world.height - 300);
		goodText.x = app.game.rnd.integerInRange(app.game.world.x + 10, app.game.world.width - goodText.width - 10);
	}
 
	if ((this.bonus > 0 && !bonus) || (this.worth < 0) && bonusFadeOut.isRunning == false) {
		if (this.worth < 0) {
			bonusText.text = 'BAD!';
		} else {
			bonusText.text = 'BONUS!';
		}
		bonusFadeIn.start();
		bonusText.y = app.game.rnd.integerInRange(app.game.world.y + 100, app.game.world.height - 300);
		bonusText.x = app.game.rnd.integerInRange(app.game.world.x + 10, app.game.world.width - bonusText.width - 10);
	}

	emitter.x = this.sprite.x + this.sprite.width/2;
    emitter.y = this.sprite.y + this.sprite.height/2;
    emitter.start(true, 600, null, app.game.rnd.integerInRange(3,6));
    emitter.forEachAlive(function(p) {
    	p.scale.setTo(scaleRatio,scaleRatio);
    	app.game.add.tween(p).to({ alpha: 0 }, 600, Phaser.Easing.easeOut, true, 0, 0, false);
    });
    app.game.time.events.add(600, destroyEmitter, this);

	score += this.worth;
	if (!bonus) {
		bonusTime += this.bonus;
	}
	destroyIng(this);
	reSpawn(this);

}

function destroyEmitter() {
	emitter.on == false;
}

// Kill ingredients after tween if not collected
function killIng(ingredient) {
	destroyIng(this);
	reSpawn(this);
}

// Respawn after killed or collected
function reSpawn(ref) {
	if (!gameOver) {
		app.game.time.events.add(ref.spawnTime, ref.spawn, ref);
	}
}

// Destroy after killed or collected
function destroyIng(ingredient) {
	ingredient.sprite.pendingDestroy = true;
}

function collectSound(ing) {
	ing.sound.play();
}

// GAME OVER
function endGame() {
	gameOver = true;
	timeLeft = 0;
	ings.callAll('destroy');
	console.log("End of Game");
	$.post(
	    "http://www.toeknee.io:3000/api/users/" + window.localStorage.getItem("userId") + "/scores",
	    { "score": score }
	);

	var challengeData = false;

	app.game.state.clearCurrentState();

	if (app.level.challengeId !== false) {

		trApi.patchChallenge(app.level.challengeId, score)
			.done(function(data) {

				app.game.state.start('game-over', true, false, score, data);

			})

	} else {

		app.game.state.start('game-over', true, false, score, challengeData);
		
	}
    
}