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
        console.error(`Failed to get userId using deviceId [${deviceId}] : ${err.responseJSON.error.message}`);
      });

  }

  getUserIdentityBySocialId(provider, externalId) {

    if (!provider || !externalId)
      throw new Error(`The externalId ${externalId} or provider ${provider} is missing in getUserIdentityBySocialId call`);

    return $.get(
        `${this.API_URL}/userIdentities?filter[where][externalId]=${externalId}`
      ).fail(function(err) {
        console.error(`Failed to get getUserIdentityBySocialId because: ${err.responseJSON.error.message}`);
      });

  }

  getUserSocial() {
    return $.get(`${this.API_URL}/users/social/${this.userId}`)
      .done(data => console.log(`got user social info ${JSON.stringify(data)}`))
      .fail(err => console.error(`Failed to get getUserIdentityBySocialId because: ${err.responseJSON.error.message}`));
  }

  postAppInstallation(opts) {

    let self = this;

    opts = __getOpts(opts);

    let deviceToken = opts.registrationId || self.storage.getItem('registrationId');
    let userId = opts.userId || self.userId || self.storage.getItem('userId');

    if (!deviceToken || !userId)
      throw new Error(`The deviceToken [${deviceToken}] or userId [${userId}] is missing in the postAppInstallation call`);

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
          console.error(`Failed to save pushRegId to server: ${err.responseJSON.error.message}`);
      });

  }

  logUserIn(opts) {

    let self = this;

    if (!self.deviceId) throw new Error('The deviceId is missing in logUserIn call');

    opts = __getOpts(opts);

    let loginUri = `/auth/${opts.provider}`;
    let loginUrl = `${self.BASE_URL}${(opts.provider === 'local' ? loginUri : '/mobile/redirect' + loginUri)}?uuid=${self.deviceId}&deviceType=${self.platform}`

    self.storage.setItem('tryLogin', 'true');

    let iab = cordova.InAppBrowser.open(loginUrl, '_self', opts.iab);

    iab.addEventListener('loadstart', function(event) {

      if (~event.url.indexOf('/auth/account'))
        iab.close();

    });

    iab.addEventListener('exit', function(event) {

      self.getUserByDeviceId().always( () => app.game.state.restart() );

    });

  }

  logUserOut() {

    let self = this;

    return $.post(
      `${self.API_URL}/users/logout`
    ).always(function() {

      self.storage.removeItem('userId');
      self.storage.removeItem('connect.sid');
      self.storage.setItem('tryLogin', 'false');

      app.game.state.restart();

    }).fail(function(err) {
      console.error(`Log out API error: ${err.responseJSON.error.message}`);
      window.location.reload(true);
    });

  }

  postChallenge(userId) {

    let self = this;

    let challengerId = self.userId || self.storage.getItem('userId');
    let challengedId = userId;

    if (!challengerId || !challengedId)
      throw new Error('Missing challenger or someone to challenge in sendChallenge call');

    return $.post(
      `${self.API_URL}/challenges`,
      { challenger: { userId: challengerId }, challenged: { userId: challengedId } }
    ).done(function(data) {
      console.log(`challenge created: ${JSON.stringify(data)}`);
    }).fail(function(err) {
      console.error(`Failed to create challenge: ${err.responseJSON.error.message}`);
    });

  }

  getChallenges() {

    let self = this;

    if (!self.userId)
      throw new Error('Missing userId in getChallenges call');

    return $.get(
      `${self.API_URL}/challenges?filter[where][or][0][challenged.userId]=${self.userId}&filter[where][or][1][challenger.userId]=${self.userId}`
    ).done(function(data) {
      console.log(`got challenges: ${JSON.stringify(data)}`);
    }).fail(function(err) {
      console.error(`Failed to get challenges: ${err.responseJSON.error.message}`);
    });

  }

  getChallengesSorted() {

    let self = this;

    if (!self.userId)
      throw new Error('Missing userId in getChallenges call');

    return $.get(`${self.API_URL}/challenges/sort/${self.userId}`)
      .done(data => console.log(`got sorted challenges: ${JSON.stringify(data)}`))
      .fail(err => console.error(`Failed to get challenges: ${err.responseJSON.error.message}`));

  }

  getOpponent(opponent) {

    let self = this;

    return $.get(
      `${self.API_URL}/users/${opponent}/identities`
    ).done(function(challenger) {

    }).fail(function(err) {
      console.error(`failed: ${err.responseJSON.error.message}`);
    });

  }


  patchChallenge(challengeId, score) {

    let self = this;

    if (!challengeId || !score)
      throw new Error(`Missing challengeId [${challengeId}] or score [${score}] in patchChallenge call`);

    return $.ajax({
      method: 'PATCH',
      url: `${self.API_URL}/challenges/${challengeId}`,
      data: { userId: self.userId, score: score },
      dataType: "json"
    }).done(function(data) {
      console.log(`updated challenge: ${JSON.stringify(data)}`);
      //app.game.state.start('game-over', true, false, score, data);
    }).fail(function(err) {
      console.error(`Failed to update challenge: ${err.responseJSON.error.message}`);
    });

  }

}