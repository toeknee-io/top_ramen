(function() {

  'use strict';

  window.pushActions = {
    acceptChallenge: function(data) {
      console.log(data);
      trApi.acceptChallenge(data.additionalData.challenge)
        .then(() => this.viewChallenges(data));
    },
    challengeRematch: function(data) {
      console.log(data);
      let userId = trApi.getOpponent(data.additionalData.challenge).userId;
      trApi.postChallenge(userId).catch(err => console.error(err));
    },
    declineChallenge: function(data) {
      console.log(data);
      trApi.declineChallenge(data.additionalData.challenge);
      navigator.app.exitApp();
    },
    playChallenge: function(data) {
      console.log(data);

      let challenge = data.additionalData.challenge;

      app.bootCreateCallback = function() {
        app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
      };

      if (!data.additionalData.coldstart)
        app.bootCreateCallback();

    },
    viewChallenge: function(data) {
      console.log(data);
      app.bootCreateCallback = function() { app.game.state.start('challenge'); };
    },
    viewChallenges: function(data) {
      console.log(data);
      app.bootCreateCallback = function() { app.game.state.start('challenges'); };
    }
  };

})();