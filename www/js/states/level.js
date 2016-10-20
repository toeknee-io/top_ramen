'use strict';app.level = {};var score;var scoreText;var goodText;var bonusText;var bonusFadeIn;var bonusFadeOut;var gameTimer;var bonusTimer;var timeLeft;let timeLeftText;var bonusTime;var bonus;var gameOver;let streakNumber;var streakText;var pop;var leftBounds;var rightBounds;var topBounds;var bottomBounds;var imageSize = '';let goodFadeIn;let goodFadeOut;var emitter;let bonusEmitter;var steamEmitter; // jshint ignore:line// Groupsvar ings;app.level.init = function(challengeId, ramenId) {	app.level.challengeId = false;	app.level.ramenId = false;	if (challengeId) {		app.level.challengeId = challengeId;	}	if (ramenId) {		app.level.ramenId = ramenId;	}};app.level.preload = function() {	console.log('Level Sate');	app.game.world.setBounds(0, 0, app.game.width, app.game.height);	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;	if (!imageSize) imageSize = '';	if (window.devicePixelRatio == 2) {		//imageSize = 'X2';	} else if (window.devicePixelRatio >= 3) {		imageSize = 'LG';	}	if (app.level.ramenId) {		app.game.load.image('menu', 'assets/' + app.level.ramenId + '.png');	}	// Level Assets	// Make spritesheet	app.game.load.image('bg', 'assets/bg' + imageSize + '.jpg');	app.game.load.image('bowl', 'assets/bowl' + imageSize + '.png');	app.game.load.image('splash', 'assets/splash.png');	app.game.load.image('steam', 'assets/steam.png');	app.game.load.image('lights', 'assets/top-lights' + imageSize + '.png');	app.game.load.image('cutting-board', 'assets/cutting-board.png');	app.game.load.atlasJSONHash('stars-sheet', 'assets/particles/stars/stars.png', 'assets/particles/stars/stars.json');	app.game.load.atlasJSONHash('spritesheet', 'assets/spritesheet.png', 'assets/spritesheet.json');	app.game.load.atlasJSONHash('ings-sheet', 'assets/ings/ings.png', 'assets/ings/ings.json');	app.game.load.bitmapFont('8bit', 'assets/fonts/8bit.png', 'assets/fonts/8bit.fnt' );	leftBounds = app.game.world.width * 0.17;	rightBounds = app.game.world.width * 0.83;	topBounds = app.game.world.height * 0.50;	bottomBounds = app.game.world.height * 0.80;	streakNumber = 0;};app.level.create = function() {	timeLeft = 60;	score = 0;	bonusTime = 0;	bonus = false;	gameOver = false;	// Groups	ings = app.game.add.group();	ings.inputEnableChildren = true;	// Set up Background	var bg = app.game.add.image(0,0, 'bg');	bg.x = app.game.width/2 - bg.width/2;	bg.moveDown();  // Set up cutting board	var cutting = app.game.add.image(app.game.world.centerX,app.game.world.centerY,'cutting-board');	cutting.scale.setTo(scaleRatio*1.7);	cutting.anchor.x = 0.5;	cutting.anchor.y = 0.5;	app.game.world.bringToTop(ings);	// Set up top light bar	var lights = app.game.add.sprite(app.game.world.centerX, 0 - 30 * scaleRatio, 'lights');	lights.anchor.x = 0.5;	// Set up bottom wooden board	var board = app.game.add.image(0 - 40 * scaleRatio,app.game.height - 200 * scaleRatio, 'spritesheet', 'board.png');	board.scale.setTo(scaleRatio, scaleRatio);	// Set up bowl	var bowl = app.game.add.image(0,0,'bowl');	//bowl.scale.setTo(scaleRatio, scaleRatio);	bowl.x = app.game.width/2 - bowl.width/2;	bowl.y = app.game.height - 10 - bowl.height;	// Audio	pop = app.game.add.audio('pop');	//var lvlSong = app.game.add.audio('lvl');	//lvlSong.play();	// Score text	scoreText = app.game.add.text(39 * scaleRatio,30 * scaleRatio,'Score \n 0',{		font: 66 * scaleRatio + 'px Baloo Paaji',		fill: '#eee',		align: "center",	});	// Time left text	timeLeftText = app.game.add.text(app.game.world.centerX,51 * scaleRatio,'60',{		font: 96 * scaleRatio + 'px Baloo Paaji',		fill: '#fff'	});	timeLeftText.anchor.x = 0.5;	// Splash	emitter = app.game.add.emitter(0, 0, 20);	emitter.makeParticles('splash');	emitter.minParticleSpeed.setTo(-800, -800);  emitter.maxParticleSpeed.setTo(800, 800);  emitter.gravity = 1000;  // Bonus	bonusEmitter = app.game.add.emitter(0,0,200);	bonusEmitter.makeParticles('stars-sheet', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);	bonusEmitter.minParticleSpeed.setTo(-1200, -1200);  bonusEmitter.maxParticleSpeed.setTo(1200, 1200);  bonusEmitter.gravity = 0;  // Steam  /*steamEmitter = app.game.add.emitter(app.game.world.centerX,10,300);  steamEmitter.makeParticles('steam');  steamEmitter.gravity = -500;  steamEmitter.setRotation(0.1, 0.1);  steamEmitter.setAlpha(0, .4, 10000);  steamEmitter.setScale(0.2, .4, 0.2, .7, 4000, Phaser.Easing.easeOut);  steamEmitter.start(false,500,20);  steamEmitter.forEachAlive(function(p) {  	p.scale.setTo(scaleRatio);  });  steamEmitter.emitX = bowl.x + bowl.width/2;  steamEmitter.emitY = bowl.y + 20;*/  // Collect Text  bonusText = app.game.add.bitmapText(0, app.game.rnd.integerInRange(40,300), '8bit', 'BONUS!');  bonusText.scale.setTo(window.devicePixelRatio * 2);	bonusText.x = app.game.world.centerX - bonusText.width/2;	bonusText.alpha = 0;	bonusFadeIn = app.game.add.tween(bonusText).to({ alpha: 1 }, 150, Phaser.Easing.easeIn, true, 0, 0, false);	bonusFadeOut = app.game.add.tween(bonusText).to({ alpha: 0 }, 400, Phaser.Easing.easeIn, true, 0, 0, false);	bonusFadeIn.chain(bonusFadeOut);	goodText = app.game.add.bitmapText(0, app.game.rnd.integerInRange(40,300), '8bit', 'GOOD');  goodText.scale.setTo(window.devicePixelRatio * 1.5);	goodText.x = app.game.world.centerX - goodText.width/2;	goodText.alpha = 0;	goodFadeIn = app.game.add.tween(goodText).to({ alpha: 1 }, 150, Phaser.Easing.easeIn, true, 0, 0, false);	goodFadeOut = app.game.add.tween(goodText).to({ alpha: 0 }, 400, Phaser.Easing.easeIn, true, 0, 0, false);	goodFadeIn.chain(goodFadeOut);	streakText = app.game.add.text(app.game.world.width * 0.80, app.game.world.height * 0.83, '', {		font: 116 * scaleRatio + 'px Baloo Paaji',		fill: '#FF0080',		align: 'right'	});	streakText.anchor.x = 0.5;	streakText.anchor.y = 0.5;	// Set up Menu	let menu = app.game.add.image(app.game.world.centerX, app.game.world.centerY, 'menu');	menu.anchor.x = 0.5;	menu.anchor.y = 0.5;	menu.scale.setTo(scaleRatio * 1.8);	let self = this;	setTimeout(function() {		app.game.add.tween(menu).to({ alpha: 0 }, 500, Phaser.Easing.easeIn, true, 0, 0, false);		setTimeout(function() {			startGame(self);		}, 1200);	}, 6000);};function startGame(ref) {	// Timer to call end of game	app.game.time.events.add(60000, time, ref);	// Timer for countdown	gameTimer = app.game.time.create(false);	gameTimer.loop(1000, updateTimer, ref);	gameTimer.start();	// Introduce Noodles	noodles.init();	// Introduce Green Onions	app.game.time.events.add(app.game.rnd.integerInRange(1000,3000), greenOnions.init, ref);	// Introduce Chili Powder & Menma	app.game.time.events.add(app.game.rnd.integerInRange(3000,6000), chili.init, ref);	app.game.time.events.add(app.game.rnd.integerInRange(3000,6000), menma.init, ref);	// Introduce Bok choy	app.game.time.events.add(app.game.rnd.integerInRange(3000,6000), bokchoy.init, ref);	// Introduce Corn & Mushrooms	app.game.time.events.add(app.game.rnd.integerInRange(7000,9000), corn.init, ref);	app.game.time.events.add(app.game.rnd.integerInRange(7000,8000), mushroom.init, ref);	// Introduce Egg & Sprouts	app.game.time.events.add(app.game.rnd.integerInRange(5000,8000), sprouts.init, ref);	app.game.time.events.add(app.game.rnd.integerInRange(10000,14000), egg.init, ref);	// Introduce Chicken & Pork	app.game.time.events.add(app.game.rnd.integerInRange(20000,25000), chicken.init, ref);	app.game.time.events.add(app.game.rnd.integerInRange(20000,25000), pork.init, ref);	// Introduce Bug	app.game.time.events.add(app.game.rnd.integerInRange(10000,15000), bug.init, ref);	// Introduce Kitty	app.game.time.events.add(app.game.rnd.integerInRange(10000,20000), kitty.init, ref);}// Countdown timer updatefunction updateTimer() {	if (!gameOver) {		timeLeft--;		timeLeftText.text = timeLeft;	}}// Called after initial 60 secondsfunction time() {	/* jshint validthis: true */	gameTimer.stop();	timeLeft = 0;	if (bonusTime > 0) {		bonus = true;		timeLeft = bonusTime;		bonusTimer = app.game.time.create(false);		bonusTimer.loop(1000, updateTimer, this);		bonusTimer.start();		app.game.time.events.add(bonusTime * 1000, endGame, this);		console.log("Bonus Time");	} else {		endGame();	}}// Collect (tap) ingredientsfunction collect(ingredient) { // jshint ignore:line	/* jshint validthis:true */	collectSound(this);	if (this.bonus === 0 && this.worth > 0 && goodFadeOut.isRunning === false) {		goodFadeIn.start();		goodText.y = app.game.rnd.integerInRange(app.game.world.y + 100, app.game.world.height - 300);		goodText.x = app.game.rnd.integerInRange(app.game.world.x + 10, app.game.world.width - goodText.width - 10);	}	if ((this.bonus > 0 && !bonus) || (this.worth < 0) && bonusFadeOut.isRunning === false) {		if (this.worth < 0) {			bonusText.text = 'BAD!';		} else {			bonusText.text = 'BONUS!';		}		bonusFadeIn.start();		bonusText.y = app.game.rnd.integerInRange(app.game.world.y + 100, app.game.world.height - 300);		bonusText.x = app.game.rnd.integerInRange(app.game.world.x + 10, app.game.world.width - bonusText.width - 10);	}	if (this.bonus === 0) {		emitter.x = this.sprite.x + this.sprite.width/2;	  emitter.y = this.sprite.y + this.sprite.height/2;	  emitter.start(true, 1000, null, app.game.rnd.integerInRange(3,6));	  emitter.forEachAlive(function(p) {	  	p.scale.setTo(scaleRatio * 1.5);	  	app.game.add.tween(p).to({ alpha: 0 }, 1000, Phaser.Easing.easeOut, true, 0, 0, false);	  });	  app.game.time.events.add(1000, destroyEmitter, this);	  if ("vibrate" in window.navigator && this.type === 'good') {	    window.navigator.vibrate(50);		} else if ("vibrate" in window.navigator && this.type === 'bad') {			window.navigator.vibrate(200);		}	} else if (this.bonus > 0) {		bonusEmitter.x = this.sprite.x + this.sprite.width/2;	  bonusEmitter.y = this.sprite.y + this.sprite.height/2;	  bonusEmitter.start(true, 1000, null, 20);	  bonusEmitter.forEachAlive(function(p) {	  	p.scale.setTo(scaleRatio);	  	app.game.add.tween(p).to({ alpha: 0 }, 1000, Phaser.Easing.easeOut, true, 0, 0, false);	  });	  app.game.time.events.add(1000, destroyEmitter, this);	  if ("vibrate" in window.navigator) {	    window.navigator.vibrate(250);		}	}	score += this.worth;	if (!bonus) {		bonusTime += this.bonus;	}	scoreText.text = 'Score\n' + score;	ingredient.alpha = 0;	this.motionTween.stop();	ingredient.y = app.game.world.height + 1000;	reSpawn(this);	if (this.type === 'good') {		streakNumber++;	} else if (this.type === 'bad') {		streakNumber = 0;	}	if (streakNumber > 2) {		streakText.text = 'STREAK\n' + streakNumber;	} else {		streakText.text = '';	}}function destroyEmitter() {	emitter.on = false;}// Respawn after killed or collectedfunction reSpawn(ref) {	if (!gameOver) {		app.game.time.events.add(ref.spawnTime, ref.spawn, ref);	}}// Destroy after killed or collectedfunction destroyIng(ing) {	ing.alpha = 0;	ing.y = app.game.world.height + 1000;	reSpawn(this);}function collectSound(ing) {	ing.sound.play();}// GAME OVERfunction endGame() {	gameOver = true;	timeLeft = 0;	streakNumber = 0;	ings.callAll('destroy');	console.log("End of Game");	var challengeData = false;	app.game.state.clearCurrentState();	if (app.level.challengeId && typeof app.level.challengeId === 'string') {		trApi.patchChallenge(app.level.challengeId, score)			.then(data => app.game.state.start('game-over', true, false, score, data));	} else {		app.game.state.start('game-over', true, false, score, challengeData);	}}