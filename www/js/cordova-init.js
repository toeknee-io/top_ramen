(function() {

    "use strict";

    let cordovaApp = {

      initialize: function() {
        this.bindEvents();
      },

      // Cordova events: https://cordova.apache.org/docs/en/latest/cordova/events/events.html
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },

      onDeviceReady: function() {

        window.trApi = new TopRamenApi();

        let dev = window.device;
        let storage = window.localStorage;

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

          if (_.isEmpty(storage.getItem('userId')))
            return console.log('got push registration event, but aborting installation api call because user is not logged in');

          let storedRegId = storage.getItem('registrationId');

          if (!storedRegId || storedRegId !== data.registrationId) {

            console.log(`new push registrationId ${data.registrationId}`);

            storage.setItem('registrationId', data.registrationId);

            trApi.postAppInstallation({ registrationId: data.registrationId, status: 'active' });

          }

        });

        cordovaApp.push.on('error', err => console.error("push err:", err.message));

        cordovaApp.push.on('notification', data => console.log(`received push notification: #{JSON.stringify(data)}`));

        window.trApi.cordovaPush = cordovaApp.push;

      }

    };

    cordovaApp.initialize();

})();