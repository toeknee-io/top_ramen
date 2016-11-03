(function cordovaInitIife({ console }) {
  window.stateHistory = [];
  window.prevState = null;

  const onBackKeyDown = (e) => {
    e.preventDefault();
    window.goBack();
  };

  const cordovaApp = {

    initialize() { this.bindEvents(); },

    bindEvents() { document.addEventListener('deviceready', this.onDeviceReady, false); },

    onDeviceReady() {
      const defaultOptions = {
        adSize: 'SMART_BANNER',
        width: 360,
        height: 90,
        position: window.AdMob.AD_POSITION.BOTTOM_CENTER,
        x: 0,
        y: 0,
        isTesting: true,
        autoShow: true,
      };
      window.AdMob.setOptions(defaultOptions);
      /*
      window.AdMob.createBanner(
        'ca-app-pub-4615826693574949/3717066510',
        () => console.log('success!'),
        err => console.error(err)
      );
      */
      document.addEventListener('backbutton', onBackKeyDown, false);

      window.trApi = new window.TopRamenApi({ cordovaApp });

      cordovaApp.push = PushNotification.init({
        android: {
          senderID: '184977555503',
          forceShow: true,
        },
        ios: {
          sound: true,
          vibration: true,
          badge: true,
        },
        windows: {},
      });

      cordovaApp.push.on('registration', (data) => {
        let saveRegId = true;
        const regId = data.registrationId;

        window.trApi.getAppInstallations()
          .then((installations) => {
            _.castArray(installations).forEach((installation) => {
              if (installation.deviceToken === regId) {
                if (installation.status === 'active') {
                  saveRegId = false;
                } else if (installation.status === 'unregistered') {
                  console.log('unregistering push registrationId because saved registrationId is invalid');

                  window.trApi.getCordovaApp().push.unregister(
                    () => console.log('successfully unregistered from push notifications'),
                    err => console.error(`err while unregistering from push notifications ${err}`)
                  );

                  saveRegId = false;
                }
              }
            });

            if (saveRegId) {
              console.log(`new push registrationId ${data.registrationId}`);

              window.trApi.setDeviceToken(data.registrationId);

              if (window.trApi.isLoggedIn()) {
                window.trApi.postAppInstallation({ registrationId: data.registrationId, status: 'active' });
              }
            }
          })
          .catch(err => console.error(err));
      });
      cordovaApp.push.on('error', err => console.error(err));
      cordovaApp.push.on('notification', data => console.log(data));
    },
  };

  cordovaApp.initialize();
}(window));
