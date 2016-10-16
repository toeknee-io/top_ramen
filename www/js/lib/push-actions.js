(function() {

  'use strict';

  window.pushActions = {
    startGameStateChallenges: function(data) {
      window.app.bootCreateCallback = function() { app.game.state.start('challenges'); };
      console.log(data);
    },
    declineChallenge: function(data) {
      window.trApi.declineChallenge(data.additionalData.challenge);
      console.log(data);
    }
  };

})();