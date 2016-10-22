(function() {

    'use strict';

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

        let optionsGroup = app.game.add.group();

        let sound;
        let music;

        sound = app.game.add.button(0, 500, 'sound', soundToggle, sound);
        music = app.game.add.button(sound.left - 80, 500, 'music', musicToggle, music);
        music.anchor.x = 1;
        music.anchor.y = .5;
        sound.anchor.y = .5;

        if (app.sound) {

            sound.alpha = 1

        } else {

            sound.alpha = .4;

        }

        if (app.music) {

            music.alpha = 1

        } else {

            music.alpha = .4;

        }

        optionsGroup.add(music);
        optionsGroup.add(sound);
        optionsGroup.x = app.game.width * .85;
        optionsGroup.y = (app.game.height * .98) - (music.height / 2);

        var optionsButton = app.game.add.button(app.game.width * .1, chefbar.bottom, 'options_button', options, optionsGroup);
        optionsButton.scale.setTo(scaleRatio);
        optionsButton.anchor.x = .5;
        optionsButton.anchor.y = .5;
        optionsButton.y = (app.game.world.height * .98) - optionsButton.height / 2;

        var tween = this.add.tween(optionsButton).to({angle: + 360}, 3500, Phaser.Easing.Linear.None, true, 0, -1);

    };

    function quickPlay() {
    	//menuSong.stop();

        let rand = app.game.rnd.integerInRange(1,3);

        let ramenId = 'shoyu';

        if (rand === 1) {

            ramenId =  'shoyu';

        } else if (rand === 2) {

            ramenId =  'tonkotsu';

        } else if (rand === 3) {

            ramenId =  'spicy_chicken';

        }

        app.game.state.start('level', true, false, false, ramenId);
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
				notLogged.anchor.x = 0.5;
				notLogged.y = app.game.world.centerY;
				notLogged.anchor.y = 0.5;
		}
    }

    function challenges() {
        if (trApi.isLoggedIn()) {
            app.game.state.start('challenges');
        } else {

            let notLogged = app.game.add.button(0, 0, 'not_logged', () => notLogged.destroy());

            notLogged.scale.setTo(scaleRatio);
            notLogged.x = app.game.world.centerX;
            notLogged.anchor.x = 0.5;
            notLogged.y = app.game.world.centerY;
            notLogged.anchor.y = 0.5;

        }
    }

    function options() {

        let self = this;

        if (self.children[0].y !== 0) {

            app.game.add.tween(self.children[0]).to({ y: 0 }, 250, Phaser.Easing.easeIn, true, 0, 0, false);

            setTimeout(function() {

                app.game.add.tween(self.children[1]).to({ y: 0 }, 250, Phaser.Easing.easeIn, true, 0, 0, false);

            }, 200)

        } else {

            app.game.add.tween(self.children[0]).to({ y: 500 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);

            setTimeout(function() {

                app.game.add.tween(self.children[1]).to({ y: 500 }, 200, Phaser.Easing.easeIn, true, 0, 0, false);

            }, 150)

        }

        /*let notifOff = app.game.add.button(0, 0, '', () => {
            window.trApi.getCordovaApp().push.unregister(
                () => console.log('successfully unregistered from push notifications'),
                err => console.error(`err while unregistering from push notifications ${err}`)
            );
            trApi.setDeviceToken(null);
        });*/

	}

    function soundToggle() {

        // jshint ignore:start
        if (app.sound === true) {

            app.sound = false;

            this.alpha = .4;

        } else if (app.sound === false) {

            app.sound = true;

            this.alpha = 1;

        }
        // jshint ignore:end
        trApi.setDeviceToken(null);

        trApi.getCordovaApp().push.unregister(
            () => console.log('successfully unregistered from push notifications'),
            err => console.error(`err while unregistering from push notifications ${err}`)
        );


    }

    function musicToggle() {

        if (app.music === true) {

            app.music = false;

            this.alpha = .4;

        } else if (app.music === false) {

            app.music = true;

            this.alpha = 1;

        }

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

        opts = window.__getOpts(opts);

        if (typeof opts.iab !== 'string') opts.iab = 'location=no,zoom=no';

        opts.provider = provider;

        trApi.logUserIn(opts)
        .then(() => {
            app.game.state.restart();
            trApi.getAppInstallations()
                .then(installations =>  {
                    let existingInstall = _.find(installations, (install) => { return install.deviceToken === trApi.getDeviceToken(); });
                    if (_.isEmpty(existingInstall)) trApi.postAppInstallation();
                })
                .catch(err => {
                    console.error(`Failed to getAppInstallations in logUserIn ${err}`);
                    if (!_.isEmpty(trApi.getDeviceToken()) && trApi.isLoggedIn())
                        trApi.postAppInstallation();
                });
        })
        .catch(err => console.error(`logUserIn failed: ${err}`));

    }

})();