
app.level = {};

let score;
let scoreText;
let goodText;
let bonusText;
let gameTimer;
let bonusTimer;
let timeLeft;
let timeLeftText;
let bonusTime;
let bonus;
let gameOver;
let streakNumber;
let streakText;

let leftBounds;
let rightBounds;
let topBounds;
let bottomBounds;

let imageSize = '';
let goodFadeIn;
let goodFadeOut;

let emitter;
let bonusEmitter;
// Groups
let ings;

function fadeInText(text, speedIn, speedOut) {
  fadeIn = app.game.add.tween(text).to({ alpha: 1 }, speedIn, Phaser.Easing.easeIn, false, 0, 0, false);
  fadeOut = app.game.add.tween(text).to({ alpha: 0 }, speedOut, Phaser.Easing.easeIn, false, 0, 0, false);
  fadeIn.chain(fadeOut);
  fadeIn.start();
}
app.level.init = function (challengeId, ramenId) {
  app.level.fabs = [];

  app.level.challengeId = false;
  app.level.ramenId = 'spicy_chicken';

  if (challengeId) {
    app.level.challengeId = challengeId;
  }

  if (ramenId) {
    app.level.ramenId = ramenId;
  }

  app.level.pop = app.game.add.audio('pop');
  app.level.bonus = app.game.add.audio('bonus');
  app.level.bad = app.game.add.audio('bad');
  app.level.bug = app.game.add.audio('bug');
  app.level.drum = app.game.add.audio('drum');
  app.level.count = app.game.add.audio('count');

  app.game.input.onDown.add(() => {
    let ing = false;

    ings.onChildInputDown.addOnce(() => {
      ing = true;
    });

    setTimeout(() => {
      if (ing === false) {
        streakNumber = 0;
        streakText.text = '';
      }
    }, 100);
  });
};
app.level.preload = function () {
  console.log('Level Sate');

  app.game.world.setBounds(0, 0, app.game.width, app.game.height);

  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  if (!imageSize) imageSize = '';

  if (window.devicePixelRatio > 3) {
    imageSize = 'LG';
  }
	// Level Assets
	// Make spritesheet
  app.game.load.image('bg', 'assets/bgLG.jpg');
  app.game.load.image('lights', 'assets/top-lightsLG.png');
  app.game.load.image('board', 'assets/board.png');
  app.game.load.atlasJSONHash('stars-sheet', 'assets/sheets/stars.png', 'assets/sheets/stars.json');
  app.game.load.atlasJSONHash('level', 'assets/sheets/level.png', 'assets/sheets/level.json');
  app.game.load.atlasJSONHash('ings-sheet', 'assets/sheets/ings.png', 'assets/sheets/ings.json');

  leftBounds = app.game.world.width * 0.17;
  rightBounds = app.game.world.width * 0.83;
  topBounds = app.game.world.height * 0.50;
  bottomBounds = app.game.world.height * 0.80;
};
app.level.create = function () {
  streakNumber = 0;
  timeLeft = 60;
  score = 0;
  bonusTime = 0;
  bonus = false;
  gameOver = false;

  app.level.drum.play();
	// Groups
  ings = app.game.add.group();
  ings.inputEnableChildren = true;
	// Set up Background
  const bg = app.game.add.image(app.game.world.centerX, app.game.world.centerY, 'bg');
  bg.anchor.x = 0.5;
  bg.anchor.y = 0.5;
  bg.moveDown();
  bg.scale.setTo(scaleRatio);
  // Set up cutting board
  const cutting = app.game.add.image(app.game.world.centerX, app.game.world.centerY, 'level', 'cutting-board');
  cutting.scale.setTo(scaleRatio * 1.5);
  cutting.anchor.x = 0.5;
  cutting.anchor.y = 0.5;
	// cutting.width = app.game.world.width * .8;

  app.game.world.bringToTop(ings);
	// Set up top light bar
  const lights = app.game.add.image(app.game.world.centerX, 0 - 30 * scaleRatio, 'lights');
  lights.anchor.x = 0.5;
  lights.scale.setTo(scaleRatio);
	// Set up bottom wooden board
  const board = app.game.add.image(0 - 40 * scaleRatio, app.game.height - 200 * scaleRatio, 'board');
  board.scale.setTo(scaleRatio);
	// Set up bowl
  const bowl = app.game.add.image(0, 0, 'level', 'bowlLG');
  bowl.scale.setTo(scaleRatio);
  bowl.x = app.game.width * 0.5 - bowl.width * 0.5;
  bowl.y = app.game.height - 10 - bowl.height;
	// Score text
  scoreText = app.game.add.bitmapText(39 * scaleRatio, 30 * scaleRatio, 'fnt', 'score\n0');
  scoreText.scale.setTo(scaleRatio * 2);
  scoreText.align = 'center';
	// Time left text
  timeLeftText = app.game.add.bitmapText(app.game.world.centerX, 51 * scaleRatio, 'fnt-orange', '60');
  timeLeftText.scale.setTo(scaleRatio * 3);
  timeLeftText.anchor.x = 0.5;
	// Splash
  emitter = app.game.add.emitter(0, 0, 20);
  emitter.makeParticles('level', 'splash');
  emitter.minParticleSpeed.setTo(-800, -800);
  emitter.maxParticleSpeed.setTo(800, 800);
  emitter.setAlpha(0, 1, 1000, Phaser.Easing.easeOut, true);
  emitter.setScale(scaleRatio * 1.3, scaleRatio * 1.3, scaleRatio * 1.3, scaleRatio * 1.3);
  emitter.gravity = 1000;
  // Bonus
  bonusEmitter = app.game.add.emitter(0, 0, 200);
  bonusEmitter.makeParticles('stars-sheet', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  bonusEmitter.minParticleSpeed.setTo(-1200, -1200);
  bonusEmitter.maxParticleSpeed.setTo(1200, 1200);
  bonusEmitter.setAlpha(0, 1, 1000, Phaser.Easing.easeOut, true);
  bonusEmitter.setScale(scaleRatio, scaleRatio, scaleRatio, scaleRatio);
  bonusEmitter.gravity = 0;
  // Collect Text
  bonusText = app.game.add.bitmapText(0, app.game.rnd.integerInRange(40, 300), 'fnt', 'bonus!');
  bonusText.scale.setTo(window.devicePixelRatio * 2);
  bonusText.x = app.game.world.centerX - bonusText.width * 0.5;
  bonusText.alpha = 0;

  goodText = app.game.add.bitmapText(0, app.game.rnd.integerInRange(40, 300), 'fnt', 'good');
  goodText.scale.setTo(window.devicePixelRatio * 1.5);
  goodText.x = app.game.world.centerX - goodText.width * 0.5;
  goodText.alpha = 0;

  streakText = app.game.add.bitmapText(app.game.width * 0.93, app.game.world.height * 0.83, 'fnt-orange', '');
  streakText.scale.setTo(scaleRatio * 3);
  streakText.align = 'center';
  streakText.anchor.x = 1;
  streakText.anchor.y = 0.5;
	// Set up Menu
  const menu = app.game.add.image(app.game.world.centerX, app.game.world.centerY - 100, 'level', app.level.ramenId);
  menu.anchor.x = 0.5;
  menu.anchor.y = 0.5;
  menu.scale.setTo(scaleRatio * 1.8);
  const menuGroup = app.game.add.group();
  const self = this;
  const startButton = app.game.add.bitmapText(app.game.world.centerX, app.game.world.height * 0.73, 'fnt', 'start');
  startButton.inputEnabled = true;

  startButton.events.onInputUp.add(() => {
    startGame(menuGroup, self);
  });

  startButton.scale.setTo(scaleRatio * 6);
  startButton.anchor.x = 0.5;
  startButton.alpha = 0;

  app.game.sound.setDecodedCallback(['pop', 'lvl'], () => {
    startButton.alpha = 1;
  });
  const menuBg = app.game.add.image(0, 0, 'main', 'lightbox_bg');
  menuBg.width = app.game.width;
  menuBg.height = app.game.height;

  menuGroup.add(menuBg);
  menuGroup.add(menu);
  menuGroup.add(startButton);

  app.level.isStarted = false;
};
function startGame(menu, self) {
  app.level.isStarted = true;

  menu.removeAll(true);
  let startCount = 2;
  const counter = app.game.add.bitmapText(app.game.world.centerX, app.game.world.height * 0.30, 'fnt', '3');
  counter.scale.setTo(scaleRatio * 6);
  counter.anchor.x = 0.5;

  app.level.count.play();
  const startTimer = app.game.time.create(false);
  startTimer.loop(1000, () => {
    if (startCount != 0) {
      counter.text = startCount;
      app.level.count.play();
      startCount--;
    } else {
      counter.text = 'start!';
      startTimer.stop();
      app.lvlSong.play();
    }
  });

  startTimer.start();

  setTimeout(() => {
    app.game.add.tween(counter).to({ alpha: 0 }, 400, Phaser.Easing.easeIn, true, 0, 0, false);
		// Timer to call end of game
    app.game.time.events.add(60000, time, self);
		// Timer for countdown
    gameTimer = app.game.time.create(false);
    gameTimer.loop(1000, updateTimer, self);
    gameTimer.start();
		// Introduce Noodles
		// noodles.init();
		// Introduce Green Onions
    app.game.time.events.add(app.game.rnd.integerInRange(500, 1000), greenOnions.init, self);
		// Introduce Chili Powder & Menma
    app.game.time.events.add(app.game.rnd.integerInRange(500, 3000), chili.init, self);
    app.game.time.events.add(app.game.rnd.integerInRange(2000, 6000), menma.init, self);
		// Introduce Bok choy
    app.game.time.events.add(app.game.rnd.integerInRange(3000, 6000), bokchoy.init, self);
		// Introduce Sake BOMBBBBB
    app.game.time.events.add(app.game.rnd.integerInRange(13000, 18000), sake.init, self);
		// Introduce Corn & Mushrooms
    app.game.time.events.add(app.game.rnd.integerInRange(1000, 9000), corn.init, self);
    app.game.time.events.add(app.game.rnd.integerInRange(3000, 8000), mushroom.init, self);
		// Introduce Egg & Sprouts
    app.game.time.events.add(app.game.rnd.integerInRange(5000, 8000), sprouts.init, self);
    app.game.time.events.add(app.game.rnd.integerInRange(10000, 14000), egg.init, self);
		// Introduce Chicken & Pork
    app.game.time.events.add(app.game.rnd.integerInRange(18000, 25000), chicken.init, self);
    app.game.time.events.add(app.game.rnd.integerInRange(18000, 25000), pork.init, self);
		// Introduce Bug
    app.game.time.events.add(app.game.rnd.integerInRange(5000, 10000), bug.init, self);
		// Introduce Kitty
    app.game.time.events.add(app.game.rnd.integerInRange(10000, 20000), kitty.init, self);
  }, 4000);
}
// Countdown timer update
function updateTimer() {
  if (!gameOver) {
    timeLeft--;
    timeLeftText.text = timeLeft;
  }
}
// Called after initial 60 seconds
function time() {
	/* jshint validthis: true */
  gameTimer.stop();
  timeLeft = 0;
  if (bonusTime > 0) {
    let bonusAlert = app.game.add.bitmapText(app.game.world.centerX, 450 * scaleRatio, 'fnt-orange', 'bonus time!');
    bonusAlert.alpha = 0;
    bonusAlert.anchor.x = 0.5;
    bonusAlert.scale.setTo(scaleRatio * 6);
    fadeInText(bonusAlert, 150, 1800);
    bonus = true;
    timeLeft = bonusTime;
    bonusTimer = app.game.time.create(false);
    bonusTimer.loop(1000, updateTimer, this);
    bonusTimer.start();
    app.game.time.events.add(bonusTime * 1000, window.endGame, this);
    console.log('Bonus Time');
  } else {
    window.endGame();
  }
}
// Collect (tap) ingredients
function collect(ingredient, pointer) { // jshint ignore:line
	/* jshint validthis:true */
  this.sound.play();

  if (this.bonus === 0 && this.worth > 0) {
    fadeInText(goodText, 150, 400);
    goodText.y = app.game.rnd.integerInRange(app.game.world.y + 100, app.game.world.height - 300);
    goodText.x = app.game.rnd.integerInRange(app.game.world.x + 10, app.game.world.width - goodText.width - 10);
  }

  if ((this.bonus > 0 && !bonus) || (this.worth < 0)) {
    if (this.worth < 0) {
      bonusText.text = 'bad!';
    } else {
      bonusText.text = 'bonus!';
    }

    fadeInText(bonusText, 150, 400);
    bonusText.y = app.game.rnd.integerInRange(app.game.world.y + 100, app.game.world.height - 300);
    bonusText.x = app.game.rnd.integerInRange(app.game.world.x + 10, app.game.world.width - bonusText.width - 10);
  }

  if (this.bonus === 0) {
    emitter.x = pointer.x;
	  emitter.y = pointer.y;
	  emitter.start(true, 1000, null, app.game.rnd.integerInRange(3, 6));
	  if ('vibrate' in window.navigator && this.type === 'good') {
	    window.navigator.vibrate(50);
  } else if ('vibrate' in window.navigator && this.type === 'bad') {
    window.navigator.vibrate(200);
  }
  } else if (this.bonus > 0) {
    bonusEmitter.x = pointer.x;
	  bonusEmitter.y = pointer.y;
	  bonusEmitter.start(true, 1000, null, 20);
	  if ('vibrate' in window.navigator) {
	    window.navigator.vibrate(250);
  }
  }

  if (this === sake) {
    const tween = app.game.add.tween(sake.text).to({ alpha: 1 }, 300, Phaser.Easing.easeIn, true, 0, 0);
    tween.yoyo(true, 1000);

    app.game.camera.shake(0.05, 5000);

    app.level.fabs.forEach((i) => {
      if (i.drunk === false) {
        i.drunk = true;
        i.worth = i.worth * 2;
      }
    });

    setTimeout(() => {
      app.level.fabs.forEach((i) => {
        if (i.drunk === true) {
          i.drunk = false;
          i.worth = i.worth * 0.5;
        }
      });
    }, 6000);
  }

  score += this.worth;
  if (!bonus) {
    bonusTime += this.bonus;
  }

  scoreText.text = `score\n${score}`;

  ingredient.alpha = 0;

  this.motionTween.stop();

  ingredient.y = app.game.world.height + 1000;

  reSpawn(this);

  if (this.type === 'good') {
    streakNumber++;
  } else if (this.type === 'bad') {
    streakNumber = 0;
  }

  if (streakNumber > 2) {
    streakText.text = `streak\n${streakNumber}`;
  } else {
    streakText.text = '';
  }
}
// Respawn after killed or collected
function reSpawn(ref) {
  if (!gameOver) {
    app.game.time.events.add(ref.spawnTime, ref.spawn, ref);
  }
}
// jshint ignore:start
// Destroy after killed or collected
function destroyIng(ing) {
  ing.alpha = 0;
  ing.y = app.game.world.height + 1000;
  reSpawn(this);
}
// jshint ignore:end
// GAME OVER
window.endGame = function () {
  gameOver = true;
  timeLeft = 0;
  streakNumber = 0;
  ings.callAll('destroy');
  console.log('End of Game');
  const challengeData = false;

  app.game.state.clearCurrentState();
  app.lvlSong.stop();

  if (app.level.challengeId && typeof app.level.challengeId === 'string') {
    trApi.patchChallenge(app.level.challengeId, score)
			.then(data => app.game.state.start('game-over', true, false, score, data))
			.catch(err => console.error('endGame.trApi.patchChallenge failed: %O', err));
  } else {
    app.game.state.start('game-over', true, false, score, challengeData);
  }

  app.level.isStarted = false;
};
