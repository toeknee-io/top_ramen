(function() {

  'use strict';

  window.pushActions = {
    acceptChallenge: function(data) {
      window.app.bootCreateCallback = function() { app.game.state.start('challenges'); };
      window.trApi.patchChallenge(data.additionalData.challenge.id, null, 'accepted');
      console.log(data);
    },
    declineChallenge: function(data) {
      window.trApi.declineChallenge(data.additionalData.challenge);
      console.log(data);
      navigator.app.exitApp();
    }
  };

})();