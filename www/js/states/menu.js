(function() {

    "use strict";

    app.menu = {};

    var imageSize = '';
    var menuSong;

    app.menu.preload = function() {

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        app.game.load.image('title', 'assets/title.png');
        app.game.load.image('title2', 'assets/title2.png');
        app.game.load.image('chefbar', 'assets/chefbar.png');
        app.game.load.image('bg', 'assets/bg4.jpg');

        app.game.load.image('play_button','assets/button_play2.png');
        app.game.load.image('challenge_button','assets/button_challenge2.png');
        app.game.load.image('challenges_button','assets/button_challenges2.png');
        app.game.load.image('options_button','assets/cog.png');
        app.game.load.image('options_menu','assets/options_menu.png');
        //app.game.load.image('login_button','assets/button_login.png');
        app.game.load.image('not_logged','assets/not_logged.png');

        app.game.load.image('fb_login','assets/fb_login2.png');
        app.game.load.image('fb_logout','assets/fb_logout2.png');

        if (!imageSize) imageSize = '';

        if (window.devicePixelRatio == 2) {
            //imageSize = 'X2';
        } else if (window.devicePixelRatio >= 3) {
            imageSize = 'LG';
        }

        app.game.load.image('bowl', 'assets/bowl' + imageSize + '.png');

        if (trApi.isLoggedIn()) {

            trApi.getUserSocial()
                .done(function(data) {

                  app.game.load.image('myPic', data.facebook.picture);

                  data.facebook.friends.forEach(function(friend) {

                      app.game.load.image(friend.id + 'pic', 'https://graph.facebook.com/' + friend.id + '/picture?type=large');

                  })

                  app.game.load.start();

                })

        }

    };

    app.menu.create = function() {
        console.log('Menu State');

        //menuSong = app.game.add.audio('menu');
        //menuSong.play();

        var bg = app.game.add.image(0, 0, 'bg');
        bg.scale.setTo(2.05 * scaleRatio);

        var title = app.game.add.image(app.game.world.centerX, 160 * scaleRatio, 'title2');
        title.anchor.x = 0.5;
        title.scale.setTo(scaleRatio);

        //var bowl = app.game.add.image(app.game.world.centerX,app.game.world.height * .24, 'bowl');
        //bowl.anchor.x = 0.5;

        var buttonGroup = app.game.add.group();

        var playButton = app.game.add.button(0, 0, 'play_button', quickPlay);
        var challengeButton = app.game.add.button(0, 0, 'challenge_button', challenge);
        var challengesButton = app.game.add.button(0, 0, 'challenges_button', challenges);

        let isLoggedIn = trApi.isLoggedIn();

        challengeButton.alpha = isLoggedIn ? 1 : .4;
        challengesButton.alpha = isLoggedIn ? 1 : .4;

        let btnImg = isLoggedIn ? 'fb_logout' : 'fb_login';
        let btnFn = isLoggedIn ? logout : fbLogin;

        let fb = app.game.add.button(0, 0, btnImg, btnFn);

        //var regs = app.game.add.button(0, 0, 'login_button', regsLogin);

        buttonGroup.add(playButton);
        buttonGroup.add(challengeButton);
        buttonGroup.add(challengesButton);
        buttonGroup.add(fb);

        buttonGroup.y = title.bottom + 70 * scaleRatio;

        var buttonSpacer = 0;

        buttonGroup.forEach(buttonsSetup, this, true);

        function buttonsSetup(child) {
            child.scale.setTo(scaleRatio);
            child.x = app.game.world.centerX;
            child.anchor.x = 0.5;
            child.y = buttonSpacer * scaleRatio;
            buttonSpacer += 200;
        }

        var chefbar = app.game.add.image(app.game.world.centerX, app.game.world.height, 'chefbar');
        chefbar.scale.setTo(scaleRatio);
        chefbar.anchor.y = 1;
        chefbar.anchor.x = .5;

        var optionsButton = app.game.add.button(app.game.world.centerX, chefbar.bottom, 'options_button', options);
        optionsButton.scale.setTo(scaleRatio);
        optionsButton.anchor.x = .5;
        optionsButton.anchor.y = .5;
        optionsButton.y = (app.game.world.height * .98) - optionsButton.height / 2;

        var tween = this.add.tween(optionsButton).to({angle: + 360}, 3500, Phaser.Easing.Linear.None, true, 0, -1);

    };

    function quickPlay() {
    	//menuSong.stop();
        app.game.state.start('level');
    }

    function challenge() {
        if (trApi.isLoggedIn()) {
          app.game.state.start('challenge');
		} else {
				var notLogged = app.game.add.button(0, 0, 'not_logged', function() {
					notLogged.destroy();
				});
				notLogged.scale.setTo(scaleRatio);
				notLogged.x = app.game.world.centerX;
				notLogged.anchor.x = .5;
				notLogged.y = app.game.world.centerY;
				notLogged.anchor.y = .5;
		}
    }

    function challenges() {
        if (trApi.isLoggedIn()) {
            app.game.state.start('challenges');
        } else {
            var notLogged = app.game.add.button(0, 0, 'not_logged', function() {
                notLogged.destroy();
            });
            notLogged.scale.setTo(scaleRatio);
            notLogged.x = app.game.world.centerX;
            notLogged.anchor.x = .5;
            notLogged.y = app.game.world.centerY;
            notLogged.anchor.y = .5;
        }
    }

    function options() {

    	let options = app.game.add.button(0, 0, 'options_menu', () => {
            window.trApi.cordovaPush.unregister(
                () => console.log('successfully unregistered from push notifications'),
                err => console.error(`err while unregistering from push notifications ${err}`)
            );
            trApi.setDeviceToken(null);
		});

		options.scale.setTo(scaleRatio);
		options.x = app.game.world.centerX;
		options.anchor.x = .5;
		options.y = app.game.world.centerY;
		options.anchor.y = .5;

	}

    function fbLogin() {
        login('facebook');
    }

    function logout() {
        trApi.logUserOut()
            .then(() => app.game.state.restart())
            .catch(err => console.error(`Logout failed ${err}`));
    }

    function regsLogin() {
    	login('local');
    }

    function login(provider, opts) {

        opts = __getOpts(opts);

        if (typeof opts.iab !== 'string') opts.iab = 'location=no,zoom=no';

        opts.provider = provider;

        trApi.logUserIn(opts)
            .then(() => {
                app.game.state.restart();
                trApi.getAppInstallations()
                    .then(installations =>  {
                        let existingInstall = _.find(installations, (install) => { return install.deviceToken === trApi.getDeviceToken(); });
                        if (_.isEmpty(existingInstall)) trApi.postAppInstallation() })
                    .catch(err => {
                        console.error(`Failed to getAppInstallations in logUserIn ${err}`);
                        if (!_.isEmpty(trApi.getDeviceToken()) && trApi.isLoggedIn())
                            trApi.postAppInstallation();
                    });
            })
            .catch(err => console.error(`logUserIn failed: ${err}`));

    }

})();