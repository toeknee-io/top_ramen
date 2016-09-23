/* jshint browser: true, jquery: true, devel: true */
/* globals cordova, app, Phaser, scaleRatio */

(function() {
 
    "use strict";

    app.menu = {};

    var imageSize = '';
    var menuSong;

    app.menu.preload = function() {

        app.game.load.image('menu_bg', 'assets/6.jpg');
        app.game.load.image('title', 'assets/title.png');

        app.game.load.image('play_button','assets/button_play.png');
        app.game.load.image('challenge_button','assets/button_challenge.png');
        app.game.load.image('options_button','assets/cog.png');
        app.game.load.image('options_menu','assets/options_menu.png');
        //app.game.load.image('login_button','assets/button_login.png');
        app.game.load.image('not_logged','assets/not_logged.png');

        app.game.load.image('fb_login','assets/fb_login.png');
        app.game.load.image('fb_logout','assets/fb_logout.png');

        if (!imageSize) imageSize = '';

        if (window.devicePixelRatio == 2) {
            imageSize = 'X2';
        } else if (window.devicePixelRatio >= 3) {
            imageSize = 'X3';
        }

        app.game.load.image('bowl', 'assets/bowl' + imageSize + '.png');

    };

    app.menu.create = function() {
        console.log('Menu State');

        //menuSong = app.game.add.audio('menu');
        //menuSong.play();

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var bg = app.game.add.image(0, 0, 'menu_bg');
        bg.scale.setTo(2.05 * scaleRatio);
        bg.x = app.game.world.centerX;
        bg.anchor.x = .5;
        bg.y = app.game.world.centerY;
        bg.anchor.y = .5;

        var title = app.game.add.image(app.game.world.centerX,app.game.world.height * .12, 'title');
        title.anchor.x = 0.5;
        title.scale.setTo(scaleRatio);

        var bowl = app.game.add.image(app.game.world.centerX,app.game.world.height * .24, 'bowl');
        bowl.anchor.x = 0.5;

        var buttonGroup = app.game.add.group();

        var playButton = app.game.add.button(0, 0, 'play_button', quickPlay);
        var challengeButton = app.game.add.button(0, 0, 'challenge_button', challenge);
        
        if (facebook) {
        	var fb = app.game.add.button(0, 0, 'fb_logout', fbLogout);
        } else {
        	var fb = app.game.add.button(0, 0, 'fb_login', fbLogin);
        }

        //var regs = app.game.add.button(0, 0, 'login_button', regsLogin);

        var optionsButton = app.game.add.button(0, 0, 'options_button', options);

        buttonGroup.add(playButton);
        buttonGroup.add(challengeButton);
        //buttonGroup.add(regs);
        buttonGroup.add(fb);
        buttonGroup.add(optionsButton);

        var buttonSpacer = 1050;

        buttonGroup.forEach(buttonsSetup, this, true);

        function buttonsSetup(child) {
            child.scale.setTo(scaleRatio);
            child.x = app.game.world.centerX;
            child.anchor.x = 0.5;
            child.y = buttonSpacer * scaleRatio;
            buttonSpacer += 200;
        }

        optionsButton.anchor.y = 0.5;
        optionsButton.x = app.game.world.width * .12;
        optionsButton.y = app.game.world.height * .92;

        var tween = this.add.tween(optionsButton).to({angle: + 360}, 3500, Phaser.Easing.Linear.None, true, 0, -1);

    };

    function quickPlay() {
    	//menuSong.stop();
        app.game.state.start('level');
    }

    function challenge() {
		if (facebook) {
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

    function options() {
    	var options = app.game.add.button(0, 0, 'options_menu', function() {
			options.destroy();
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

    function fbLogout() {

    }

    function regsLogin() {
    	login('local');
    }

    function login(provider, opts) {

        if (provider !== 'local') provider = 'auth/' + provider;
        if (!opts || typeof opts !== 'string') opts = 'location=no,zoom=no';

        var devId = window.device.uuid;
        var storage = window.localStorage;

        console.log('logging in device.uuid', devId);

        var ref = cordova.InAppBrowser.open('http://www.toeknee.io:3000/mobile/redirect/' + provider + '?uuid=' + devId, '_self', opts);

        storage.setItem('tryLogin', true);

        ref.addEventListener('loadstart', function(event) {
           
            console.log('loadstart url:', event.url);
            
            if (~event.url.indexOf('/auth/account')) {

                $.get(
                  "http://www.toeknee.io:3000/api/devices/findOne?filter[where][deviceId]=" + devId
                ).done(function(data) {
                  
                    if (data && data.userId) {
                      
                        storage.setItem('userId', data.userId);                      
                        storage.removeItem('tryLogin');
                      
                        ref.close();

                        getIdentity(data,provider);              
                  
                    }
                    
                }).fail(function(err) {
                  console.error("failed to get userId using device.uuid:", err.message);
                });  
                
            }
            
        });

    }

})();