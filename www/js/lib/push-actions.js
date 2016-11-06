(function pushAcionsIife({ app }) {
  function isColdStart(data) {
    return data.additionalData.coldstart;
  }

  function assignAndDoCb(data, bootCreateCallback) {
    Object.assign(app, { bootCreateCallback });
    if (!isColdStart(data)) {
      app.bootCreateCallback();
    }
  }

  function viewState(state, data) {
    console.log(data);
    const bootCreateCallback = () => app.game.state.start(state);
    assignAndDoCb(data, bootCreateCallback);
  }

  function onConfirm(data, buttonIndex) {
    console.info(`Selected button ${buttonIndex}`);
    window.tru.getDeclineChallengeOpts()[buttonIndex](data);
  }

  window.pushActions = {
    acceptChallenge(data) {
      window.trApi.acceptChallenge(data.additionalData.challenge.id)
        .then(() => this.viewChallenges(data))
        .catch(err => console.error(err));
    },
    challengeRematch(data) {
      const userId = window.ChallengeUtils.getOpponent(data.additionalData.challenge).userId;
      window.trApi.postChallenge(userId)
        .then(() => this.viewChallenges(data))
        .catch(err => console.error(err));
    },
    declineChallenge(data) {
      window.trApi.declineChallenge(data.additionalData.challenge.id)
        .then(() => {
          navigator.notification.confirm(
            'Challenge Declined  \uD83D\uDC4E',
             onConfirm.bind(this, data),
             'What now?',
            ['Challenge Someone', 'View Other Challenges', 'Exit']
          );
        })
        .catch((err) => {
          navigator.notification.confirm(
            `Whoops, couldn't decline challenge because: ${err.message}\n\n You can still decline by clicking the x on the Challenges screen`,
             onConfirm.bind(this, data),
             'What now?',
            ['Challenge Someone', 'View Other Challenges', 'Exit']
          );
        });
    },
    playChallenge(data) {
      const challenge = data.additionalData.challenge;
      const bootCreateCallback = function bootCreateCallback() {
        app.game.state.start('level', true, false, challenge);
      };
      assignAndDoCb(data, bootCreateCallback);
    },
    viewChallenge(data) {
      viewState('challenge', data);
    },
    viewChallenges(data) {
      viewState('challenges', data);
    },
  };
}(window));
