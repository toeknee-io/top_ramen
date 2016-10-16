(function() {

  window.pushActions = {
    startGameStateChallenges: function(data) {
      console.log(data);
      window.app.bootCreateCallback = function() { app.game.state.start('challenges'); };
    },
    declineChallenge: function(data) {
      console.log(data);
      window.trApi.declineChallenge(data.additionalData.challenge);
    }
  };

})();