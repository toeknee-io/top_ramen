'use strict';

app.challenge = {};

app.challenge.preload = function() {

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	app.game.kineticScrolling = app.game.plugins.add(Phaser.Plugin.KineticScrolling);

	app.game.kineticScrolling.configure({
    kineticMovement: true,
    timeConstantScroll: 425,
    verticalScroll: true,
    horizontalScroll: false,
    verticalWheel: true
  });

  app.game.kineticScrolling.start();

  app.game.load.image('sent', 'assets/challenge_sent.png');
  app.game.load.image('play_now', 'assets/play_now.png');
  app.game.load.image('yes', 'assets/yes.png');
  app.game.load.image('no', 'assets/no.png');
  app.game.load.image('friendbar', 'assets/friendbar.png');

  trApi.getUserSocial()
    .done(function(data) {

  		if (!app.game.cache.checkImageKey('myPic'))
      	app.game.load.image('myPic', data.facebook.picture);

      data.facebook.friends.forEach(function(friend) {

      	let picKey = friend.id + 'pic';

      	if (!app.game.cache.checkImageKey(picKey))
          app.game.load.image(friend.id + 'pic', 'https://graph.facebook.com/' + friend.id + '/picture?type=large');

      });

      app.game.load.onLoadComplete.addOnce(displayFriends, data);

      app.game.load.start();

    });

};

app.challenge.create = function() {

	console.log('Challenge State');

	var bg = app.game.add.image(0, 0, 'menu_bg');
	bg.scale.setTo(scaleRatio * 2.05);
	bg.fixedToCamera = true;

	var homeButton = app.game.add.button(30, 30, 'home', window.goHome);
	homeButton.scale.setTo(scaleRatio);

};

function displayFriends() {

	var chefbar = app.game.add.image(app.game.world.centerX, app.game.world.height + 200, 'friendbar');
  chefbar.scale.setTo(scaleRatio);
  chefbar.fixedToCamera = true;
  chefbar.anchor.y = 1;
  chefbar.anchor.x = 0.5;

	/*let userPic;

	if (app.game.cache.checkImageKey('myPic')) {

		userPic = app.game.add.image(0, 260 * scaleRatio, 'myPic');

	} else {

		userPic = app.game.add.image(0, 260 * scaleRatio, 'chef');

	}

	userPic.scale.setTo(0.8 * scaleRatio);
	userPic.x = app.game.world.centerX;
	userPic.anchor.x = 0.5;

	*/

	var picY = 450 * scaleRatio;

	var friendGroup = app.game.add.group();

	let data = this;

	if (app.game.state.current === "challenge") {

		/*var welcomeText = app.game.add.text(app.game.world.centerX, 160 * scaleRatio, 'Hi, ' + data.facebook.displayName + '!', {
			font: 50 * scaleRatio + 'px Baloo Paaji',
			fill: '#fff',
			align: "right",
		});*/

		var welcomeText = app.game.add.bitmapText(app.game.world.centerX, 240 * scaleRatio, 'fnt', 'your friends');
		welcomeText.scale.setTo(scaleRatio * 3);
		welcomeText.anchor.x = 0.5;

    data.facebook.friends.forEach(function(friend) {

    	var butt = app.game.add.button(0, picY, 'item');

    	var yLoc;

    	butt.onInputDown.add(function() {

      	yLoc = app.game.world.y;

      });

      butt.onInputUp.add(function() {

  			if (yLoc === app.game.world.y) {

  				challengeFn(friend);
  				console.log(this);

  			}

  		});

			butt.scale.setTo(0.8 * scaleRatio);
			butt.centerX = app.game.world.centerX;

			let buttPic;

			if (app.game.cache.checkImageKey(friend.id + 'pic')) {

				buttPic = app.game.add.image(30, 30, friend.id + 'pic');

			} else {

				buttPic = app.game.add.image(30, 30, 'chef');

			}

			var buttText = app.game.add.text(buttPic.width + 20, 30, friend.name, {
				font: 'bold 60px Baloo Paaji',
				fill: '#fff',
				align: "right",
			} );

			butt.addChild(buttText);
			butt.addChild(buttPic);

			buttPic.scale.setTo(0.8);

			friendGroup.add(butt);

			picY += 200 * scaleRatio;

    });

    app.game.world.setBounds(0, 0, app.game.width, friendGroup.height + 1000 * scaleRatio);

	}

	chefbar.bringToTop();

}

function challengeFn(friend) {

	console.log('Challenged: ' + friend.name);

	let provider = 'facebook';

	trApi.getUserIdentityBySocialId(provider, friend.id)
		.done(function(identities) {

      trApi.getRamen().then(ramen => {

  			identities.forEach(identity => {

  				let rand = app.game.rnd.integerInRange(0, ramen.length - 1);

  				let ramenId = ramen[rand].id;

  				if (identity.provider === provider) {
  					trApi.postChallenge(identity.userId, ramenId)
              .then(data => challengeSentPopup(data))
              .catch(err => console.error(`Failed because: ${JSON.stringify(err)}`));
  				}

  			});

      });

		}).fail(function(err) {
   		console.error(`Failed to iterate over getUserIdentityBySocialId response because: ${err.responseJSON.error.message}`);
    });

}

function challengeSentPopup(id) {

	let btnGroup = app.game.add.group();

	let lb_bg = app.game.add.button(0, 0, 'lb_bg');
	let sent = app.game.add.image(app.game.world.centerX, 0, 'play_now');
	let yes = app.game.add.button(app.game.world.centerX, app.game.height / 2, 'yes', playNow, id);
	let no = app.game.add.button(app.game.world.centerX, 0, 'no', playLater, btnGroup);

	lb_bg.width = app.game.width;
	lb_bg.height = app.game.height;

	yes.scale.setTo(scaleRatio);
	yes.anchor.x = 0.5;
	yes.anchor.y = 0.5;

	sent.scale.setTo(scaleRatio);
	sent.y = yes.y - 500;
	sent.anchor.x = 0.5;

	no.scale.setTo(scaleRatio);
	no.y = yes.y + 170;
	no.anchor.x = 0.5;

	btnGroup.add(lb_bg);
	btnGroup.add(sent);
	btnGroup.add(yes);
	btnGroup.add(no);

	btnGroup.fixedToCamera = true;

}

function playNow() {

	app.game.sound.stopAll();

	buttonSound();

	app.game.world.setBounds(0, 0, app.game.width, app.game.height);
	app.game.state.start('level', true, false, this.id, this.ramenId);

}

function playLater() {

	this.destroy();

}