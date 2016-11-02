(function topRamenApiIife() {
  window.getOpts = function getOpts(opts) {
    if (typeof opts === 'object') {
      return opts;
    }
    return {};
  };

  function checkIfObj(obj, fnName) {
    if (typeof obj !== 'object') {
      throw new Error(`Invalid arguments passed to ${fnName} ${obj}`);
    }
  }

  window.TopRamenApi = class TopRamenApi {

    constructor(opts = {}) {
      if (!(this instanceof TopRamenApi)) {
        return new TopRamenApi(opts);
      }

      if (!window.jQuery || !window.cordova || !window._ || !window.Promise) {
        throw new Error("Stuff's missing!");
      }

      this.APP_NAME = 'com.bitsmitten.topramen';

      this.BASE_URL = 'http://www.toeknee.io:3000';
      this.API_URL = `${this.BASE_URL}/api`;

      this.ITEM_KEY_USER_ID = 'userId';
      this.ITEM_KEY_ACCESS_TOKEN = 'accessToken';
      this.ITEM_KEY_DEVICE_TOKEN = 'registrationId';

      this.CACHE_KEY_CHALLENGES = 'challenges';
      this.CACHE_KEY_RAMEN = 'ramen';

      this.cache = {};
      this.cache[this.CACHE_KEY_RAMEN] = {};
      this.cache[this.CACHE_KEY_CHALLENGES] = {};

      this.app = window.app;
      this.storage = window.localStorage;
      this.session = window.sessionStorage;
      this.device = window.device;
      this.Promise = window.Promise;

      this.deviceId = this.device.uuid;
      this.platform = (opts.platform || this.device.platform).toLowerCase();

      this.userId = opts.userId || this.storage.getItem(this.ITEM_KEY_USER_ID);
      this.accessToken = opts.accessToken || this.storage.getItem(this.ITEM_KEY_ACCESS_TOKEN);
      this.deviceToken = opts.deviceToken || this.storage.getItem(this.ITEM_KEY_DEVICE_TOKEN);

      this.cordovaApp = opts.cordovaApp || {};

      this.getAccessToken = () =>
        this.accessToken || this.storage.getItem(this.ITEM_KEY_ACCESS_TOKEN);

      this.setAccessToken = (accessToken) => {
        this.accessToken = accessToken;
        if (!accessToken) {
          this.storage.removeItem(this.ITEM_KEY_ACCESS_TOKEN);
        } else {
          this.storage.setItem(this.ITEM_KEY_ACCESS_TOKEN, accessToken);
          $.ajaxSetup({ beforeSend: xhr => xhr.setRequestHeader('Authorization', this.getAccessToken()) });
        }
      };

      this.isValidLoginToken = function isValidLoginToken(token) {
        return token && !_.isEmpty(token) && token !== 'null' && token !== 'undefined';
      };

      if (this.accessToken) {
        this.setAccessToken(this.accessToken);
      }
      return this;
    }

    getUserId() {
      return this.userId || this.storage.getItem(this.ITEM_KEY_USER_ID);
    }

    setUserId(userId) {
      this.userId = userId;
      if (!userId) this.storage.removeItem(this.ITEM_KEY_USER_ID);
      else this.storage.setItem(this.ITEM_KEY_USER_ID, userId);
    }

    getDeviceToken() {
      return this.deviceToken || this.storage.getItem(this.ITEM_KEY_DEVICE_TOKEN);
    }

    setDeviceToken(deviceToken) {
      this.deviceToken = deviceToken;
      if (!deviceToken) this.storage.removeItem(this.ITEM_KEY_DEVICE_TOKEN);
      this.storage.setItem(this.ITEM_KEY_DEVICE_TOKEN, deviceToken);
    }

    setCordovaApp(cordovaApp) {
      this.cordovaApp = cordovaApp;
    }

    getCordovaApp() { return this.cordovaApp; }

    getUserByDeviceId() {
      if (!this.deviceId) throw new Error('Cannot getUserByDeviceId without deviceId');
      return $.get(`${this.API_URL}/devices/${this.deviceId}/user`)
        .fail(err => console.error(`Failed to get userId using deviceId [${this.deviceId}] : ${err.responseJSON.error.message}`));
    }

    getUserIdentityById(id) {
      return new this.Promise((resolve, reject) => {
        if (_.isNil(id) || typeof id !== 'string') {
          reject(`TopRamenApi.getUserIdentityById error: invalid id argument [${id}]`);
        } else {
          $.get(`${this.API_URL}/userIdentities/${id}`)
            .done((userIdentity => resolve(userIdentity)))
            .fail(err => reject(err));
        }
      });
    }

    getUserIdentityBySocialId(provider, externalId) {
      if (!provider || !externalId || !this.isLoggedIn()) { return console.error(`The getUserIdentityBySocialId call requires externalId [${externalId}], provider [${provider}], and isLoggedIn [${this.isLoggedIn()}]`); }
      return $.get(`${this.API_URL}/userIdentities?filter[where][externalId]=${externalId}`)
        .fail(err => console.error(`Failed to getUserIdentityBySocialId: ${err.responseJSON.error.message}`));
    }

    getUserSocial() {
      return new this.Promise((resolve, reject) => {
        if (!this.isLoggedIn()) {
          reject('trApi.getUserSocial error: The user must be logged in to make the getUserSocial call');
        } else {
          $.get(`${this.API_URL}/users/social`)
            .done(userSocial => resolve(userSocial))
            .fail(err => reject(err));
        }
      });
    }

    postAppInstallation(opts = {}) {
      this.deviceToken = opts.registrationId || this.getDeviceToken();

      if (!this.deviceToken || !this.isLoggedIn()) {
        throw new Error(`The deviceToken [${this.deviceToken}] or userId [${this.getUserId()}] is missing in the postAppInstallation call`);
      }

      return $.post(
        `${this.API_URL}/users/me/installations`,
        {
          appId: `${this.APP_NAME}.${opts.platform || this.platform}`,
          deviceToken: this.deviceToken,
          deviceType: opts.platform || this.platform,
          status: opts.status || 'active',
        })
        .fail(err => console.error(`Failed to postAppInstallation: ${err.responseJSON.error.message}`));
    }

    getAppInstallations() {
      return new this.Promise((resolve, reject) => {
        if (!this.isLoggedIn()) throw new Error(`The user must be logged in to getAppInstallations, userId [${this.getUserId()}] accessToken [${this.getAccessToken()}]`);

        $.get(`${this.API_URL}/users/me/installations`)
          .done(installations => resolve(installations))
          .fail(err => reject(err));
      });
    }

    logUserIn(opts) {
      return new this.Promise((resolve, reject) => {
        if (!opts) throw new Error('No options provided to logUserIn.');
        if (!this.deviceId) throw new Error('The deviceId is missing in logUserIn call.');

        const loginUri = `/auth/${opts.provider}`;
        const loginUrl = `${this.BASE_URL}${(opts.provider === 'local' ?
          loginUri : `/mobile/redirect${loginUri}`)}?` +
          `uuid=${this.deviceId}&deviceType=${this.platform}`;

        const iab = cordova.InAppBrowser.open(loginUrl, '_self', opts.iab);

        iab.addEventListener('loadstart', (event) => {
          const url = event.url.split('?');

          if (url[0] === `${this.BASE_URL}/login`) {
            reject(new Error('Passport login failed.'));
          }

          if (url[0] === `${this.BASE_URL}/mobile/redirect/auth/success`) {
            const token = url[1].split('token=')[1].split('&id=')[0];
            const userId = url[1].split('id=')[1].split('&')[0];

            if (_.isEmpty(token) || _.isEmpty(userId)) {
              reject(new Error('No accessToken or userId was returned from login.'));
            } else {
              this.setAccessToken(token);
              this.setUserId(userId);
              resolve(iab.close());
            }
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
            resolve();
          })
          .fail(err => reject(err));
      });
    }

    isLoggedIn() {
      return this.isValidLoginToken(this.getAccessToken());
    }

    postChallenge(userId, ramenId) {
      return new this.Promise((resolve, reject) => {
        this.clearLocalCache(this.CACHE_KEY_CHALLENGES);
        if (!this.isLoggedIn()) { throw new Error('User must be logged in to make postChallenge call.'); }
        $.post(
            `${this.API_URL}/challenges`,
            { userId, ramenId, status: 'new' }
          )
          .done(data => resolve(data))
          .fail(err => reject(err));
      });
    }

    getChallengesSorted() {
      return new this.Promise((resolve, reject) => {
        if (!this.isLoggedIn()) {
          reject(new Error('User must be logged in to getChallengesSorted.'));
        }
        $.get(`${this.API_URL}/challenges/sort/me`)
          .done((challenges) => {
            this.setLocalCache(this.CACHE_KEY_CHALLENGES, challenges);
            resolve(this.getLocalCache(this.CACHE_KEY_CHALLENGES));
          })
          .fail(err => reject(err));
      });
    }

    patchChallenge(challenge, score, status) {
      return new this.Promise((resolve, reject) => {
        let data = {};

        this.clearLocalCache(this.CACHE_KEY_CHALLENGES);

        if (typeof challenge === 'string' &&
          (typeof score === 'number' || typeof status === 'string')) {
          data.id = challenge;
          data.score = score;
          data.status = status;
        } else if ((typeof challenge === 'object' && typeof challenge.id === 'string') &&
          (typeof challenge.score === 'number' || typeof challenge.status === 'string')) {
          data = challenge;
        } else {
          throw new Error(`Invalid arguments passed to patchChallenge: ${challenge}`);
        }

        $.ajax({
          method: 'PATCH',
          url: `${this.API_URL}/challenges/${data.id}`,
          data,
          dataType: 'json',
        })
        .done(res => resolve(res))
        .fail(err => reject(err));
      });
    }

    acceptChallenge(challenge) {
      checkIfObj(challenge, this.acceptChallenge.name);
      Object.assign(challenge,
        { [ChallengeUtils.getPlayerPropertyKey(challenge)]: { inviteStatus: 'accepted' } }
      );
      return this.patchChallenge(challenge);
    }

    declineChallenge(challenge) {
      checkIfObj(challenge, this.declineChallenge.name);
      Object.assign(challenge,
        { [ChallengeUtils.getPlayerPropertyKey(challenge)]: { inviteStatus: 'declined' } }
      );
      return this.patchChallenge(challenge);
    }

    hideChallenge(challenge) {
      checkIfObj(challenge, this.hideChallenge.name);
      Object.assign(challenge,
        { [ChallengeUtils.getPlayerPropertyKey(challenge)]: { hidden: true } }
      );
      return this.patchChallenge(challenge);
    }

    getScores() {
      return new this.Promise((resolve, reject) => {
        if (!this.isLoggedIn()) {
          reject(new Error('User must be logged in to getScores.'));
        } else {
          $.get(`${this.API_URL}/users/me/scores`)
            .done(scores => resolve(scores))
            .fail(err => reject(new Error(`Failed to getScores: ${err.responseJSON.error.message}`)));
        }
      });
    }

    getRamen() {
      return new this.Promise((resolve, reject) => {
        const cachedRamen = this.getLocalCache(this.CACHE_KEY_RAMEN);
        if (!_.isEmpty(cachedRamen) && _.isArray(cachedRamen)) {
          resolve(cachedRamen);
        } else {
          $.get(`${this.API_URL}/ramen`)
          .done((ramen) => {
            this.setLocalCache(this.CACHE_KEY_RAMEN, ramen);
            resolve(ramen);
          })
          .fail(err => reject(err));
        }
      });
    }

    initUser() {
      return new this.Promise((resolve, reject) => {
        if (this.isLoggedIn()) {
          if (!this.app.game.cache.checkImageKey('myPic')) {
            this.getUserSocial()
              .then(data => this.app.game.load.image('myPic', data.facebook.picture))
              .catch(err => reject(err));
          }
          const cachedChallenges = this.getLocalCache(this.CACHE_KEY_CHALLENGES);
          if (!_.isEmpty(cachedChallenges)) {
            resolve(cachedChallenges);
          } else {
            this.getChallengesSorted()
            .then((challenges) => {
              const challengeKeys = Object.keys(challenges);
              console.debug('initUser.getChallengesSorted.challengeKeys: %O', challengeKeys);
              if (_.isEmpty(challengeKeys)) {
                resolve();
              } else {
                let keyCount = 0;
                let challengesDone = 0;
                let challengesTotal = 0;

                challengeKeys.forEach((key) => {
                  challengesTotal += challenges[key].length;

                  challenges[key].forEach((challenge) => {
                    const result = _.attempt(() => {
                      const identity = challenge[challenge.challenger.userId === this.getUserId() ? 'challenged' : 'challenger'].identities[0];
                      const picKey = `${identity.externalId}pic`;

                      if (!this.app.game.cache.checkImageKey(picKey)) {
                        this.app.game.load.image(picKey, `https://graph.facebook.com/${identity.externalId}/picture?type=large`);
                      }
                    });

                    if (_.isError(result)) console.error(result);

                    challengesDone += 1;
                  });

                  keyCount += 1;

                  if (keyCount === challengeKeys.length && challengesDone === challengesTotal) {
                    resolve(challenges);
                  }
                });
              }
            }).catch(err => reject(err));
          }
        } else {
          resolve();
        }
      });
    }

    setLocalCache(key, data) {
      Object.assign(this.cache, { [key]: data });
    }

    getLocalCache(key) {
      const data = this.cache[key];
      if (_.isNil(data)) {
        throw new Error(`Return value for getLocalCache using key [${key}] isNil.  This key should be set as an empty object in the constructor if it needs to be used.`);
      }
      return data;
    }

    clearLocalCache(key) {
      this.cache[key] = {};
    }

  };
}());
