(function() {

  'use strict';

  window.pushActions = {
    viewChallenges: function(data) {
      window.app.bootCreateCallback = function() { app.game.state.start('challenges'); };
      console.log(data);
    },
    acceptChallenge: function(data) {
      window.trApi.patchChallenge(data.additionalData.challenge.id, null, 'accepted')
        .then(() => this.viewChallenges());
      console.log(data);
    },
    declineChallenge: function(data) {
      window.trApi.declineChallenge(data.additionalData.challenge);
      console.log(data);
      navigator.app.exitApp();
    }
  };

})();