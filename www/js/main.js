(function mainIife({ app }) {
  app.game.state.add('boot', app.boot);
  app.game.state.add('menu', app.menu);
  app.game.state.add('challenges', app.challenges);
  app.game.state.add('challenge', app.challenge);
  app.game.state.add('level', app.level);
  app.game.state.add('game-over', app.gameover);
  app.game.state.add('challengeResults', app.challengeResults);

  app.game.state.onStateChange.add((newState, oldState) => {
    window.stateHistory.push(newState);
    if (oldState && oldState !== 'level') {
      window.prevState = oldState;
    }
  });

  const DEFAULT_SATE = 'menu';

  window.goToState = function goToState(state = DEFAULT_SATE) {
    app.game.world.setBounds(0, 0, app.game.width, app.game.height);
    app.game.state.clearCurrentState();
    app.game.state.start(state);
  };

  window.goBack = function goBack() {
    window.buttonSound();

    const currState = (app.game.state.current || DEFAULT_SATE).toLowerCase();
    const prevState = window.prevState;

    if (currState === 'menu') {
      if (window.confirm('Exit Top Ramen?')) {
        navigator.app.exitApp();
      }
    } else if (prevState === 'challengeResults') {
      window.goToState('challenges');
    } else if (currState === 'level' && window.app.level.isStarted) {
      window.app.game.pause = true;

      const msg = app.level.challengeId ?
        `Your current score of ${window.score} will be submitted for this challenge.` : '';

      if (window.confirm(`Exit Level?\n\n${msg}`)) {
        window.endGame();
      } else {
        window.app.game.pause = false;
      }
    } else {
      window.goToState(currState !== prevState ? prevState : DEFAULT_SATE);
    }
  };

  window.goHome = function goHome() {
    window.buttonSound();

    window.goToState('menu');
  };

  app.game.state.start('boot');
}(window));
