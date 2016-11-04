(function constantsIife({ $, alert }) {
  const Constants = window.TopRamenConstants = {};

  Constants.URL = { BASE: 'http://www.toeknee.io:3000' };
  Constants.URL.API = { BASE: `${Constants.URL.BASE}/api` };

  Object.assign(Constants.URL.API, {
    CONSTANTS: `${Constants.URL.API.BASE}/constants`,
    LOG_OUT: `${Constants.URL.API.BASE}/auth/logout`,
    DEVICES: `${Constants.URL.API.BASE}/devices`,
    USER_IDENTITIES: `${Constants.URL.API.BASE}/userIdentities`,
    USER_SOCIAL: `${Constants.URL.API.BASE}/users/social`,
    INSTALLATIONS: `${Constants.URL.API.BASE}/users/me/installations`,
    CHALLENGES: `${Constants.URL.API.BASE}/challenges`,
    CHALLENGES_SORT: `${Constants.URL.API.BASE}/challenges/sort/me`,
    SCORE: `${Constants.URL.API.BASE}/users/me/scores`,
    RAMEN: `${Constants.URL.API.BASE}/ramen`,
  });

  $.get(`${Constants.URL.API.CONSTANTS}`)
    .done(constants => Object.assign(Constants, constants))
    .fail(err => alert(err));
}(window));
