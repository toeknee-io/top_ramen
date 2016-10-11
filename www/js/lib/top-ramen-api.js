function __getOpts(opts) {

  if (!opts || typeof opts !== 'object')
    return {};
  else
    return opts;

}

class TopRamenApi {

  constructor(opts) {

    if (!window.jQuery || !window.cordova || !window._)
      throw new Error("Stuff's missing!");

    opts = __getOpts(opts);

    this.APP_NAME = 'com.bitsmitten.topramen';

    this.BASE_URL = 'http://www.toeknee.io:3000';
    this.API_URL = `${this.BASE_URL}/api`;

    this.storage = window.localStorage;
    this.session = window.sessionStorage;
    this.device = window.device;

    this.userId = opts.userId || this.storage.getItem('userId');

    this.deviceId = this.device.uuid;
    this.platform = (opts.platform || this.device.platform).toLowerCase();

    this.pushRegId = opts.pushRegId || this.storage.getItem('registrationId');

  }

  getUserByDeviceId(opts) {

    opts = __getOpts(opts);

    let deviceId = opts.deviceId || this.deviceId;

    return $.get(`${this.API_URL}/devices/findOne?filter[where][deviceId]=${deviceId}`)
      .done(data => { if (data && data.userId) this.userId = data.userId; })
      .fail(err => console.error(`Failed to get userId using deviceId [${deviceId}] : ${err.responseJSON.error.message}`));

  }

  getUserIdentityBySocialId(provider, externalId) {

    let userId = this.storage.getItem('userId');

    if (!provider || !externalId || _.isEmpty(userId))
      return console.error(`The externalId ${externalId} and provider ${provider} must be provided, and the userId must be in localStorage [${userId}] to make the getUserIdentityBySocialId call`);

    return $.get(`${this.API_URL}/userIdentities?filter[where][externalId]=${externalId}`)
      .fail(err => console.error(`Failed to get getUserIdentityBySocialId because: ${err.responseJSON.error.message}`));

  }

  getUserSocial() {
    if (_.isEmpty(this.storage.getItem('userId')))
      return console.error(`The userId must be in localStorage [${userId}] to make getUserSocial call`);
    return $.get(`${this.API_URL}/users/social/${this.userId}`)
      .fail(err => console.error(`Failed to get getUserSocial because: ${err.responseJSON.error.message}`));
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

    if (!this.deviceId) throw new Error('The deviceId is missing in logUserIn call');

    opts = __getOpts(opts);

    let loginUri = `/auth/${opts.provider}`;
    let loginUrl = `${this.BASE_URL}${(opts.provider === 'local' ? loginUri : '/mobile/redirect' + loginUri)}?uuid=${this.deviceId}&deviceType=${this.platform}`

    let iab = cordova.InAppBrowser.open(loginUrl, '_self', opts.iab);

    iab.addEventListener('loadstart', event => {

      if (~event.url.indexOf('/login')) {
        console.error('Login flow failed');
        //this.logUserOut();
        //iab.close();
      }

      if (~event.url.indexOf('/mobile/redirect/auth/success')) {
        this.getUserByDeviceId({ deviceId: this.deviceId })
          .done(data => {
            if (data.userId) {
              this.storage.setItem('userId', data.userId);
              this.userId = data.userId;
            } else {
              this.logUserOut();
              throw new Error("No userId was returned by getUserByDeviceId call");
            }
            app.game.state.restart();
          })
          .fail(err => console.error(`Failed to getUserByDeviceId during login with deviceId ${this.deviceId}: ${err.responseJSON.error.message}`))
          .always(() => iab.close());
      }

    });

  }

  logUserOut() {

    return $.post(`${this.API_URL}/auth/logout`)
      .fail(err => console.error(`Log out API error: ${err.responseJSON.error.message}`))
      .always(() => {

        this.storage.clear();

        app.game.state.restart();

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
      { challenger: { userId: challengerId }, challenged: { userId: challengedId } })
    .done(data => console.log(`challenge created: ${JSON.stringify(data)}`))
    .fail(err => console.error(`Failed to create challenge: ${err.responseJSON.error.message}`));

  }

  getChallenges() {

    let self = this;

    if (!self.userId)
      throw new Error('Missing userId in getChallenges call');

    return $.get(`${self.API_URL}/challenges?filter[where][or][0][challenged.userId]=${self.userId}&filter[where][or][1][challenger.userId]=${self.userId}`)
      .fail((err) => console.error(`Failed to get challenges: ${err.responseJSON.error.message}`));

  }

  getChallengesSorted() {

    let self = this;

    if (!self.userId)
      throw new Error('Missing userId in getChallenges call');

    return $.get(`${self.API_URL}/challenges/sort/${self.userId}`)
      .fail(err => console.error(`Failed to get challenges: ${err.responseJSON.error.message}`));

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