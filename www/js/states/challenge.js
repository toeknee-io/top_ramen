app.challenge = {}

app.challenge.preload = function() {

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	app.game.kineticScrolling = app.game.plugins.add(Phaser.Plugin.KineticScrolling);

	app.game.kineticScrolling.configure({
    kineticMovement: true,
    verticalScroll: true,
    horizontalScroll: false,
    verticalWheel: true
  });

  app.game.kineticScrolling.start();

  app.game.load.image('sent', 'assets/challenge_sent.png');
  app.game.load.image('play_now', 'assets/play_now.png');
  app.game.load.image('yes', 'assets/yes.png');
  app.game.load.image('no', 'assets/no.png');

  trApi.getUserSocial()
    .done(function(data) {

  		if (!app.game.cache.checkImageKey('myPic'))
      	app.game.load.image('myPic', data.facebook.picture);

      data.facebook.friends.forEach(function(friend) {

      	let picKey = friend.id + 'pic';

      	if (!app.game.cache.checkImageKey(picKey))
          app.game.load.image(friend.id + 'pic', 'https://graph.facebook.com/' + friend.id + '/picture?type=large');

      })

      app.game.load.onLoadComplete.addOnce(displayFriends, data);

      app.game.load.start();

    });

}

app.challenge.create = function() {

	console.log('Challenge State');

	var bg = app.game.add.image(0, 0, 'bg');
	bg.scale.setTo(scaleRatio * 2.05);
	bg.fixedToCamera = true;

	var homeButton = app.game.add.button(30, 30, 'home', goHome);
	homeButton.scale.setTo(scaleRatio);

}

function displayFriends() {

	if (app.game.cache.checkImageKey('myPic')) {

		var userPic = app.game.add.image(0, 260 * scaleRatio, 'chef');

	} else {

		var userPic = app.game.add.image(0, 260 * scaleRatio, 'chef');

	}

	userPic.scale.setTo(.8 * scaleRatio);
	userPic.x = app.game.world.centerX;
	userPic.anchor.x = .5;

	var picY = 500 * scaleRatio;

	var friendGroup = app.game.add.group();

	let data = this;

	if (app.game.state.current === "challenge") {

		var welcomeText = app.game.add.text(app.game.world.centerX, 160 * scaleRatio, 'Hi, ' + data.facebook.displayName + '!', {
			font: 50 * scaleRatio + 'px Baloo Paaji',
			fill: '#fff',
			align: "right",
		});

		welcomeText.anchor.x = .5;

    data.facebook.friends.forEach(function(friend) {

      var butt = app.game.add.button(0, picY, 'item', challengeFn, friend);

			butt.scale.setTo(.8 * scaleRatio);
			butt.centerX = app.game.world.centerX;

			if (app.game.cache.checkImageKey(friend.id + 'pic')) {

				var buttPic = app.game.add.image(30, 30, friend.id + 'pic');

			} else {

				var buttPic = app.game.add.image(30, 30, 'chef');

			}

			var buttText = app.game.add.text(buttPic.width + 20, 30, friend.name, {
				font: 60 + 'px Baloo Paaji',
				fill: '#fff',
				align: "right",
			} );

			butt.addChild(buttText);
			butt.addChild(buttPic);

			buttPic.scale.setTo(.8);

			friendGroup.add(butt);

			picY += 200 * scaleRatio;

    })

    app.game.world.setBounds(0, 0, app.game.width, friendGroup.height + 600 * scaleRatio);

	}

}

function challengeFn() {

	console.log('Challenged: ' + this.name);

	let provider = 'facebook';

	trApi.getUserIdentityBySocialId(provider, this.id)
		.done(function(identities) {

			identities.forEach(function(identity) {

				let rand = app.game.rnd.integerInRange(1,3);

				let ramenId = 'shoyu';

				if (rand === 1) {

					ramenId =  'shoyu';

				} else if (rand === 2) {

					ramenId =  'tonkotsu';

				} else if (rand === 3) {

					ramenId =  'spicy_chiken';

				}

				if (identity.provider === provider) {
					trApi.postChallenge(identity.userId, ramenId)
						.done(data => challengeSentPopup(data))
						.fail(err => console.error(`Failed because: ${JSON.stringify(err)}`));
				}

			});

		}).fail(function(err) {
   		console.error(`Failed to iterate over getUserIdentityBySocialId response because: ${err.responseJSON.error.message}`);
    });

}

function challengeSentPopup(id) {

	var btnGroup = app.game.add.group();

	var sent = app.game.add.image(0, 200, 'play_now');
	var yes = app.game.add.button(0, 450, 'yes', playNow, id);
	var no = app.game.add.button(0, 700, 'no', playLater, btnGroup);

	sent.scale.setTo(scaleRatio);
	sent.x = app.game.world.centerX;
	sent.anchor.x = .5;

	yes.scale.setTo(scaleRatio);
	yes.x = app.game.world.centerX;
	yes.anchor.x = .5;

	no.scale.setTo(scaleRatio);
	no.x = app.game.world.centerX;
	no.anchor.x = .5;

	btnGroup.add(sent);
	btnGroup.add(yes);
	btnGroup.add(no);

}

function playNow() {

	app.game.world.setBounds(0, 0, app.game.width, app.game.height);
	app.game.state.start('level', true, false, this.id, this.ramenId);

}

function playLater() {

	this.destroy();

}