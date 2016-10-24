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

        window.trApi = new window.TopRamenApi({ cordovaApp });

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

          let saveRegId = true;
          let regId = data.registrationId;

          trApi.getAppInstallations()
            .then(installations => {

              installations = _.castArray(installations);

              installations.forEach(installation => {

                if (installation.deviceToken === regId) {

                  if (installation.status === 'active') {

                    saveRegId = false;

                  } else if (installation.status === 'unregistered') {

                    console.log('unregistering push registrationId because saved registrationId is invalid');

                    trApi.getCordovaApp().push.unregister(
                      () => console.log('successfully unregistered from push notifications'),
                      err => console.error(`err while unregistering from push notifications ${err}`)
                    );

                     saveRegId = false;

                  }

                }

              });

              if (saveRegId) {

                console.log(`new push registrationId ${data.registrationId}`);

                trApi.setDeviceToken(data.registrationId);

                if (trApi.isLoggedIn())
                  trApi.postAppInstallation({ registrationId: data.registrationId, status: 'active' });

              }

            })
            .catch(err => console.error(err));


        });

        cordovaApp.push.on('error', err => console.error(err));

        cordovaApp.push.on('notification', data => console.log(data));

      }

    };

    cordovaApp.initialize();

})();