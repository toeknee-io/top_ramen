(function(app) {

  'use strict';

  app.game.state.add('boot', app.boot);
  app.game.state.add('menu', app.menu);
  app.game.state.add('challenges', app.challenges);
  app.game.state.add('challenge', app.challenge);
  app.game.state.add('level', app.level);
  app.game.state.add('game-over', app.gameover);
  app.game.state.add('challengeResults', app.challengeResults);

  app.game.state.onStateChange.add((newState, oldState) => {

    window.__stateHistory.push(newState);

    if (oldState && oldState !== 'level')
      window.__prevState = oldState;

  });

  window.goToState = function (state) {

    state = state || 'menu';

    app.game.world.setBounds(0, 0, app.game.width, app.game.height);
    app.game.state.clearCurrentState();
    app.game.state.start(state);

  };

  window.goBack = function() {

    if (app.game.state.current === 'menu') {
      if (window.confirm('Exit Top Ramen?'))
        navigator.app.exitApp();
      else
        return;
    }

    let state = app.game.state.current !== window.__prevState ?
      window.__prevState : 'menu';

    window.goToState(state);

  };

  window.goHome = function() {

    window.goToState('menu');

  };

  app.game.state.start('boot');

})(window.app);