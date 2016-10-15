function __getOpts(opts) {
  if (!opts || typeof opts !== 'object')
    return {};
  else
    return opts;
}

class TopRamenApi {

  constructor(opts) {

    if (!window.jQuery || !window.cordova || !window._ || !window.Promise)
      throw new Error("Stuff's missing!");

    opts = __getOpts(opts);

    this.APP_NAME = 'com.bitsmitten.topramen';

    this.BASE_URL = 'http://www.toeknee.io:3000';
    this.API_URL = `${this.BASE_URL}/api`;

    this.ITEM_KEY_USER_ID = 'userId';
    this.ITEM_KEY_ACCESS_TOKEN = 'accessToken';
    this.ITEM_KEY_DEVICE_TOKEN = 'registrationId';

    this.storage = window.localStorage;
    this.session = window.sessionStorage;
    this.device = window.device;
    this.Promise = window.Promise;

    this.deviceId = this.device.uuid;
    this.platform = (opts.platform || this.device.platform).toLowerCase();

    this.userId = opts.userId || this.storage.getItem(this.ITEM_KEY_USER_ID);
    this.accessToken = opts.accessToken || this.storage.getItem(this.ITEM_KEY_ACCESS_TOKEN);
    this.deviceToken = opts.deviceToken || this.storage.getItem(this.ITEM_KEY_DEVICE_TOKEN);

    this.getAccessToken = () => { return this.accessToken || this.storage.getItem(this.ITEM_KEY_ACCESS_TOKEN) };

    this.getAccessTokenByUserId = (userId) => { return $.get(`${this.API_URL}/users/${userId || this.userId}/accessTokens?filter[order]=created%20DESC`) };

    this.setAccessToken = (accessToken) => {
      this.accessToken = accessToken;
      if (!accessToken) {
        this.storage.removeItem(this.ITEM_KEY_ACCESS_TOKEN);
      } else {
        this.storage.setItem(this.ITEM_KEY_ACCESS_TOKEN, accessToken);
        $.ajaxSetup({ beforeSend: xhr => xhr.setRequestHeader("Authorization", this.getAccessToken()) })
      }
    };

    if (this.accessToken)
      this.setAccessToken(this.accessToken);
    else if (this.userId)
      this.getAccessTokenByUserId(this.userId).done(tokens => this.setAccessToken(tokens[0].id));

  }

  getUserId() { return this.userId || this.storage.getItem(this.ITEM_KEY_USER_ID); }

  setUserId(userId) {
    this.userId = userId;
    if (!userId) this.storage.removeItem(this.ITEM_KEY_USER_ID);
    else this.storage.setItem(this.ITEM_KEY_USER_ID, userId);
  }

  getDeviceToken() { return this.deviceToken || this.storage.getItem(this.ITEM_KEY_DEVICE_TOKEN); }

  setDeviceToken(deviceToken) {
    this.deviceToken = deviceToken;
    if (!deviceToken) this.storage.removeItem(this.ITEM_KEY_DEVICE_TOKEN);
    this.storage.setItem(this.ITEM_KEY_DEVICE_TOKEN, deviceToken);
  }

  getUserByDeviceId(opts) {
    if (!this.deviceId) throw new Error('Cannot getUserByDeviceId without deviceId');
    return $.get(`${this.API_URL}/devices/${this.deviceId}/user`)
      .fail(err => console.error(`Failed to get userId using deviceId [${deviceId}] : ${err.responseJSON.error.message}`));
  }

  getUserIdentityBySocialId(provider, externalId) {

    if (!provider || !externalId || _.isEmpty(this.getUserId()))
      return console.error(`The getUserIdentityBySocialId call requires externalId [${externalId}], provider [${provider}], and userId [${this.getUserId()}]`);

    return $.get(`${this.API_URL}/userIdentities?filter[where][externalId]=${externalId}`)
      .fail(err => console.error(`Failed to getUserIdentityBySocialId: ${err.responseJSON.error.message}`));

  }

  getUserSocial() {
    if (!this.isLoggedIn())
      return console.error(`The user must be logged in to make the getUserSocial call.`);
    return $.get(`${this.API_URL}/users/social/me`)
      .fail(err => console.error(`Failed to get getUserSocial because: ${err}`));
  }

  postAppInstallation(opts) {

    opts = __getOpts(opts);

    this.deviceToken = opts.registrationId || this.getDeviceToken();

    if (!this.deviceToken || !this.getUserId())
      throw new Error(`The deviceToken [${this.deviceToken}] or userId [${this.getUserId()}] is missing in the postAppInstallation call`);

    return $.post(
      `${this.API_URL}/users/me/installations`,
        {
          "appId": `${this.APP_NAME}.${opts.platform || this.platform}`,
          "deviceToken": this.deviceToken,
          "deviceType": opts.platform || this.platform,
          "status": opts.status || "active"
        })
      .fail(err => console.error(`Failed to postAppInstallation: ${err.responseJSON.error.message}`));

  }

  getAppInstallations(opts) {
    return new this.Promise((resolve, reject) => {

      if (!this.getUserId()) throw new Error(`The userId [${this.getUserId()}] is missing in the getAppInstallations call`);

      $.get(`${this.API_URL}/users/me/installations`)
        .done(installations => resolve(installations))
        .fail(err => reject(new Error(`Failed to getAppInstallationByDeviceToken: ${err.responseJSON.error.message}`)));

    });
  }

  logUserIn(opts) {
    return new this.Promise((resolve, reject) => {

      if (!opts) throw new Error('No options provided to logUserIn.');
      if (!this.deviceId) throw new Error('The deviceId is missing in logUserIn call.');

      let loginUri = `/auth/${opts.provider}`;
      let loginUrl = `${this.BASE_URL}${(opts.provider === 'local' ? loginUri : '/mobile/redirect' + loginUri)}?uuid=${this.deviceId}&deviceType=${this.platform}`

      let iab = cordova.InAppBrowser.open(loginUrl, '_self', opts.iab);

      iab.addEventListener('loadstart', event => {

        let url = event.url.split('#')[0];

        if (url === `${this.BASE_URL}/login`)
          reject(new Error('Passport login failed.'));

        if (url === `${this.BASE_URL}/mobile/redirect/auth/success`) {
          this.getUserByDeviceId({ deviceId: this.deviceId })
            .done(data => {
              if (data.id) {
                this.setUserId(data.id);
                this.getAccessTokenByUserId(data.id).done(tokens => this.setAccessToken(tokens[0].id));
                resolve(data);
              } else {
                reject(new Error("No userId was returned by getUserByDeviceId call"));
              }})
            .fail(err => reject(new Error(`Failed to getUserByDeviceId during login with deviceId ${this.deviceId}: ${err.responseJSON.error.message}`)))
            .always(() => resolve(iab.close()));
        }

      });
    });
  }

  logUserOut() {
    return new this.Promise((resolve, reject) => {
      $.post(`${this.API_URL}/auth/logout`)
        .done(() => {
          this.setAccessToken(null);
          this.setUserId(null);
          resolve(); })
        .fail(err => reject(err))
    });
  }

  isLoggedIn() {
    return this.getUserId() && !_.isEmpty(this.getUserId()) && this.getUserId() !== 'null' && this.getUserId() !== 'undefined';
  }

  postChallenge(userId) {

    let challengerId = this.getUserId();
    let challengedId = userId;

    if (!challengerId || !challengedId)
      throw new Error(`The postChallenge call is missing challengerId [${challengerId}] or challengedId [${challengedId}].`);

    return $.post(
        `${this.API_URL}/challenges`,
        { challenger: { userId: challengerId }, challenged: { userId: challengedId } })
      .done(data => console.log(`challenge created: ${JSON.stringify(data)}`))
      .fail(err => console.error(`Failed to create challenge: ${err.responseJSON.error.message}`));

  }

  getChallenges() {
    if (!this.isLoggedIn()) throw new Error('User must be logged in to getChallenges.');
    return $.get(
        `${this.API_URL}/challenges?filter[where][or][0][challenged.userId]=${this.getUserId()}&` +
        `filter[where][or][1][challenger.userId]=${this.getUserId()}`)
      .fail((err) => console.error(`Failed to get challenges: ${err.responseJSON.error.message}`));
  }

  getChallengesSorted() {
    if (!this.isLoggedIn()) throw new Error('User must be logged in to getChallengesSorted.');
    return $.get(`${this.API_URL}/challenges/sort/me`)
      .fail(err => console.error(`Failed to get challenges: ${err.responseJSON.error.message}`));
  }

  patchChallenge(challengeId, score) {

    if (!challengeId || !score)
      throw new Error(`Missing challengeId [${challengeId}] or score [${score}] in patchChallenge call.`);

    return $.ajax({
        method: 'PATCH',
        url: `${this.API_URL}/challenges/${challengeId}`,
        data: { userId: this.getUserId(), score: score },
        dataType: "json"})
      .done(data => console.log(`updated challenge: ${JSON.stringify(data)}`))
      .fail(err => console.error(`Failed to patchChallenge: ${err.responseJSON.error.message}`));

  }

  getScores() {
    return new this.Promise((resolve, reject) => {
      if (!this.isLoggedIn()) return reject(new Error('User must be logged in to getScores.'));
      $.get(`${this.API_URL}/users/me/scores`)
        .done(scores => resolve(scores))
        .fail(err => reject(new Error(`Failed to getScores: ${err.responseJSON.error.message}`)));
    });
  }

}