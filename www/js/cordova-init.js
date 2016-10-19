(function() {

    'use strict';

    window.__stateHistory = [];
    window.__prevState = null;

    let onBackKeyDown = (e) => {
      e.preventDefault();
      window.goBack();
    };

    let cordovaApp = {

      initialize: function() {
        this.bindEvents();
      },

      bindEvents: function() { document.addEventListener('deviceready', this.onDeviceReady, false); },

      onDeviceReady: function() {

        document.addEventListener("backbutton", onBackKeyDown, false);

        window.trApi = new window.TopRamenApi();

        cordovaApp.push = PushNotification.init({
          "android": {
            "senderID": "184977555503",
            "forceShow": true
          },
          "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
          },
          "windows": {}
        });

        cordovaApp.push.on('registration', function(data) {

          if (!trApi.getDeviceToken() || trApi.getDeviceToken() !== data.registrationId) {

            console.log(`new push registrationId ${data.registrationId}`);

            trApi.setDeviceToken(data.registrationId);

            if (trApi.isLoggedIn())
              trApi.postAppInstallation({ registrationId: data.registrationId, status: 'active' });

          }

        });

        cordovaApp.push.on('error', err => console.error(err));

        cordovaApp.push.on('notification', (data) => console.log(data));

        trApi.setCordovaApp(cordovaApp);

      }

    };

    cordovaApp.initialize();

})();