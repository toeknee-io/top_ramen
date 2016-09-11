/* jshint browser: true, jquery: true, devel: true */
/* globals cordova, app, Phaser, scaleRatio */

(function() {
 
    "use strict";

    app.menu = {};

    var imageSize = '';

    app.menu.preload = function() {

        app.game.load.image('menu_bg', 'assets/bg4.jpg');
        app.game.load.image('title', 'assets/title.png');

        app.game.load.image('play_button','assets/button_play.png');
        app.game.load.image('challenge_button','assets/button_challenge.png');
        app.game.load.image('options_button','assets/cog.png');

        app.game.load.image('fb_login','assets/fb_login.png');
        app.game.load.image('google','assets/google.png');
        app.game.load.image('regs','assets/regs.png');

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

        var menuSong = app.game.add.audio('menu');
        //menuSong.play();

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var bg = app.game.add.image(0,0,'menu_bg');
        bg.scale.setTo(scaleRatio*2.05);

        var title = app.game.add.image(app.game.world.centerX,app.game.world.height * .05,'title');
        title.anchor.x = 0.5;
        title.scale.setTo(scaleRatio);

        var bowl = app.game.add.image(app.game.world.centerX,app.game.world.height * .17,'bowl');
        bowl.anchor.x = 0.5;

        var buttonGroup = app.game.add.group();

        var playButton = app.game.add.button(0,0,'play_button', quickPlay);
        var challengeButton = app.game.add.button(0,0,'challenge_button', challenge);
        var fb = app.game.add.button(0,0,'fb_login', fbLogin);
        var googs = app.game.add.button(0,0,'google', googleLogin);
        var regs = app.game.add.button(0,0,'regs', regsLogin);

        var optionsButton = app.game.add.button(0,0,'options_button', options);

        buttonGroup.add(playButton);
        buttonGroup.add(challengeButton);
        buttonGroup.add(regs);
        buttonGroup.add(fb);
        buttonGroup.add(googs);
        buttonGroup.add(optionsButton);

        var buttonSpacer = 950;

        buttonGroup.forEach(buttonsSetup,this,true);

        function buttonsSetup(child) {
            child.scale.setTo(scaleRatio, scaleRatio);
            child.x = app.game.world.centerX;
            child.anchor.x = 0.5;
            child.y = buttonSpacer * scaleRatio;
            buttonSpacer += 220;
        }

        fb.anchor.x = 1;
        fb.x = regs.x - 10;
        googs.anchor.x = 0;
        googs.x = regs.x + 10;
        googs.y = regs.y + 218 * scaleRatio;

        optionsButton.anchor.y = 0.5;
        optionsButton.x = app.game.world.width * .12;
        optionsButton.y = app.game.world.height * .92;

        var tween = this.add.tween(optionsButton).to({angle:+360}, 1500, Phaser.Easing.Linear.None, true, 0,-1);

    };

    function quickPlay() {
        app.game.state.start('level');
    }

    function challenge() {

    }

    function options() {

    }

    function fbLogin() {
        login('facebook');
    }

    function googleLogin() {
        login('google');
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

        ref.addEventListener('loadstop', function(event) {
           
            console.log('loadstop url:', event.url);
            
            if (~event.url.indexOf('/auth/account')) {

                $.get(
                  "http://www.toeknee.io:3000/api/devices/findOne?filter[where][deviceId]=" + devId
                ).done(function(data) {
                  
                    if (data && data.userId) {
                      
                        storage.setItem('userId', data.userId);                      
                        storage.removeItem('tryLogin');
                      
                        ref.close();
                  
                    }
                    
                }).fail(function(err) {
                  console.error("failed to get userId using device.uuid:", err.message);
                });  
                
            }
            
        });

    }

})();