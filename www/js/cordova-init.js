/* jshint browser: true, jquery: true, devel: true */
/* globals PushNotification */

window.trApi = null;

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

          if (storage.getItem('tryLogin') !== 'false' && dev && dev.uuid) {

            console.log('getting user for device.uuid', dev.uuid);

            trApi.getUserByDeviceId();

          }

          cordovaApp.push = PushNotification.init({
            "android": {
              "senderID": "184977555503"
            },
            "ios": {
              "sound": true,
              "vibration": true,
              "badge": true
            },
            "windows": {}
          });

          cordovaApp.push.on('registration', function(data) {

              let storedRegId = storage.getItem('registrationId');

              console.log(`onRegistration registrationId ${data.registrationId}`);

              if (!storedRegId || storedRegId !== data.registrationId) {

                storage.setItem('registrationId', data.registrationId);

                let opts = {};
                opts.registrationId = data.registrationId;

                trApi.postAppInstallation(opts);

              }

          });

          cordovaApp.push.on('error', function(err) {
              console.error("push err:", err.message);
          });

          cordovaApp.push.on('notification', function(data) {
              console.log("received push notification:", JSON.stringify(data));
          });

      }

    };

    cordovaApp.initialize();

})();