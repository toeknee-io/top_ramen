(function pushAcionsIife({ app }) {
  window.pushActions = {
    acceptChallenge(data) {
      window.trApi.acceptChallenge(data.additionalData.challenge)
        .then(() => this.viewChallenges(data));
    },
    challengeRematch(data) {
      const userId = window.trApi.getChallengeOpponent(data.additionalData.challenge).userId;
      window.trApi.postChallenge(userId).catch(err => console.error(err));
    },
    declineChallenge(data) {
      window.trApi.declineChallenge(data.additionalData.challenge);
      navigator.app.exitApp();
    },
    playChallenge(data) {
      const challenge = data.additionalData.challenge;
      const bootCreateCallback = function bootCreateCallback() {
        app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
      };
      Object.assign(app, { bootCreateCallback });
      if (!data.additionalData.coldstart) {
        app.bootCreateCallback();
      }
    },
    viewChallenge() {
      const bootCreateCallback = function bootCreateCallback() { app.game.state.start('challenge'); };
      Object.assign(app, { bootCreateCallback });
    },
  };
}(window));
