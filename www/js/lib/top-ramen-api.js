function __getOpts(opts) {

  if (!opts || typeof opts !== 'object')
    return {};
  else
    return opts;

}

class TopRamenApi {

  constructor(opts) {

    if (!window.jQuery || !window.cordova)
      throw new Error("Stuff's missing!");

    opts = __getOpts(opts);

    this.APP_NAME = 'com.bitsmitten.topramen';

    this.BASE_URL = 'http://www.toeknee.io:3000';
    this.API_URL = `${this.BASE_URL}/api`;

    this.storage = window.localStorage;
    this.device = window.device;

    this.userId = opts.userId || this.storage.getItem('userId');

    this.deviceId = opts.deviceId || this.device.uuid;
    this.platform = (opts.platform || this.device.platform).toLowerCase();

    this.pushRegId = opts.pushRegId || this.storage.getItem('registrationId');

  }

  getUserByDeviceId(opts) {

    let self = this;

    opts = __getOpts(opts);

    let deviceId = opts.deviceId || this.deviceId;

    return $.get(
      `${this.API_URL}/devices/findOne?filter[where][deviceId]=${deviceId}`
      ).done(function(data) {

        if (data && data.userId) {

            self.userId = data.userId;

            self.storage.setItem('userId', data.userId);
            self.storage.setItem('tryLogin', 'false');

            self.getUserIdentity(data.userId);

        }

      }).fail(function(err) {
        console.error(`Failed to get userId using deviceId [${deviceId}] : ${err.message}`);
      });

  }

  getUserIdentity(userId) {

    userId = userId || this.userId;

    if (!userId) throw new Error('The userId is missing in getUserIdentity call');

    return $.get(
        `${this.API_URL}/users/${userId}/identities`
      ).done(function(user) {

        user = user[0];

        if (user.provider === 'facebook') {
          facebook = true;
          console.log('facebook');
          let token = user.credentials.accessToken;
          userName = user.profile.displayName;
          userPic = `https://graph.facebook.com/me/picture?access_token=${token}&type=large`;
          userFBFriends = $.get(`https://graph.facebook.com/me/friends?access_token=${token}`);
          app.game.state.restart();
        }

    }).fail(function(err) {
      console.error("failed: " + err.message);
    });

  }

  postAppInstalation(opts) {

    let self = this;

    opts = __getOpts(opts);

    let deviceToken = opts.registrationId || self.storage.getItem('registrationId');
    let userId = opts.userId || self.userId;

    if (!deviceToken || !userId)
      throw new Error(`The deviceToken [${deviceToken}] or userId [${userId}] is missing in the postAppInstalation call`);

    return $.post(
        `${this.API_URL}/installations`,
        {
            "appId": `${self.APP_NAME}.${opts.platform || self.platform}`,
            "deviceToken": deviceToken,
            "deviceType": opts.platform || self.platform,
            "status": opts.status || "Active",
            "userId": userId
        }
      ).done(function(msg) {
          console.log(`pushRegId saved to server: ${JSON.stringify(msg)}`);
      }).fail(function(err) {
          console.error(`Failed to save pushRegId to server: ${err.message}`);
      });

  }

  logUserIn(opts) {

    let self = this;

    if (!self.deviceId) throw new Error('The deviceId is missing in logUserIn call');

    opts = __getOpts(opts);

    let loginUri = `/auth/${opts.provider}`;
    let loginUrl = `${self.BASE_URL}${(opts.provider === 'local' ? loginUri : '/mobile/redirect' + loginUri)}?uuid=${self.deviceId}`

    console.log(`logging in with url ${loginUrl}`);

    self.storage.setItem('tryLogin', 'true');

    let iab = cordova.InAppBrowser.open(loginUrl, '_self', opts.iab);

    iab.addEventListener('loadstart', function(event) {

      console.log('loadstart url:', event.url);

      if (~event.url.indexOf('/auth/account'))
        iab.close();

    });

    iab.addEventListener('exit', function(event) {

      console.log('iab exiting after social login');

      self.getUserByDeviceId().always( () => app.game.state.restart() );

    });

  }

  logUserOut() {

    let self = this;

    $.post(
      `${self.API_URL}/users/logout`
    ).fail(function(err) {
      console.error(`failed to log out user: ${err.message}`);
    }).always(function() {

      console.info("logging user out, clearing cookies and restarting game state");

      self.storage.removeItem('userId');
      self.storage.removeItem('connect.sid');
      self.storage.setItem('tryLogin', 'false');

      app.game.state.restart();

    });

  }

}