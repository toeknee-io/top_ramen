/* eslint no-console: "off" */

(function pushAcionsIife() {
  const trApi = window.trApi;
  const app = window.app;

  window.pushActions = {
    acceptChallenge(data) {
      console.log(data);
      trApi.acceptChallenge(data.additionalData.challenge)
        .then(() => this.viewChallenges(data));
    },
    challengeRematch(data) {
      const userId = trApi.getChallengeOpponent(data.additionalData.challenge).userId;
      trApi.postChallenge(userId).catch(err => console.error(err));
    },
    declineChallenge(data) {
      console.log(data);
      trApi.declineChallenge(data.additionalData.challenge);
      navigator.app.exitApp();
    },
    playChallenge(data) {
      const challenge = data.additionalData.challenge;
      app.bootCreateCallback = function bootCreateCallback() {
        app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
      };

      if (!data.additionalData.coldstart) {
        app.bootCreateCallback();
      }
    },
    viewChallenge(data) {
      console.log(data);
      app.bootCreateCallback = function bootCreateCallback() { app.game.state.start('challenge'); };
    },
  };
}());
