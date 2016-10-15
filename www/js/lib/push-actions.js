(function() {

  window.pushActions = {
    startGameStateChallenges: function() {
      window.app.bootCreateCallback = function() { app.game.state.start('challenges'); };
    }
  };

})();