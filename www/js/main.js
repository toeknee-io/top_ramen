(function() {

  'use strict';

  app.game.state.add('boot', app.boot);
  app.game.state.add('menu', app.menu);
  app.game.state.add('challenges', app.challenges);
  app.game.state.add('challenge', app.challenge);
  app.game.state.add('level', app.level);
  app.game.state.add('game-over', app.gameover);
  app.game.state.add('challengeResults', app.challengeResults);

  app.game.state.onStateChange.add((newState, oldState) => app.__prevState = oldState);

  function goToState(state) {
    app.game.world.setBounds(0, 0, app.game.width, app.game.height);
    app.game.state.clearCurrentState();
    app.game.state.start(state);
  }

  window.goHome = () => goToState('menu');

  window.goBack = () => {

    let currState = app.game.state.current;

    if (_.isEmpty(app.__prevState) || _.isEmpty(currState) ||
      currState === 'menu' || currState === 'boot') {
      navigator.app.exitApp();
    } else if (app.__prevState === 'level') {
      goHome();
    } else {
      goToState(app.__prevState);
    }

  };

  app.game.state.start('boot');

})();