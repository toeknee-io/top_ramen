(function () {
  window.ChallengeUtils = class ChallengeUtils {

    static getUser(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenger : challenge.challenged; } else {
        throw new Error('Could not getChallengeUser for userId %s from challenge %O', window.trApi.getUserId(), challenge);
      }
    }

    static getOpponent(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenged : challenge.challenger; } else { throw new Error('Could not getChallengeOpponent for userId %s from challenge %O', window.trApi.getUserId(), challenge); }
    }

    static initGroupTitles(bitmapTexts) {
      _.castArray(bitmapTexts)
        .forEach((bitmapText) => {
          bitmapText.align = 'center';
          bitmapText.scale.setTo(scaleRatio * 3);
          bitmapText.anchor.x = 0.5;
        });
    }

    static getButtonStatusText(challenge) {
      const userScore = ChallengeUtils.getUser(challenge).score;
      const opponent = ChallengeUtils.getOpponent(challenge);

      if (challenge.status !== 'finished') {
        return _.isNil(userScore) && _.isNil(opponent.score) ?
          'Not Started' : (_.isNil(userScore) ? 'Your Turn' : 'Their Turn'); } else {
        return challenge.winner === 'tied' ? 'Tied' :
          (userScore > opponent.score ? 'You Won!' :
            opponent.score > userScore ? 'You Lost' : 'wtf?!'); }
    }

    static addButtonPicture(picKey) {
      return app.game.cache.checkImageKey(picKey) ?
        app.game.add.image(30, 30, picKey) : app.game.add.image(30, 30, 'main', 'chef-holder');
    }

    static addButtonOpponentText(width, displayName) {
      return app.game.add.text(width + 20, 30, displayName, {
        font: 'bold 60px Arial',
        fill: '#fff',
        align: 'right',
      });
    }

    static addButtonStatusText(width, status) {
      return app.game.add.text(width + 20, 120, status, {
        font: 'bold 40px Arial',
        fill: '#fff',
        align: 'right',
      });
    }

    static configureButton(challenge, yLoc) {
      const butt = app.game.add.button(0, yLoc);

      butt.loadTexture('main', 'item_bg');

      butt.onInputDown.add(() => {
        const yLoc = app.game.world.y;

        butt.onInputUp.add(() => {
          if (yLoc === app.game.world.y) {
            ChallengeUtils.challengeStart(challenge);
          }
        }, challenge);
      });

      butt.scale.setTo(0.8 * scaleRatio);
      butt.centerX = app.game.world.centerX;

      const opponent = ChallengeUtils.getOpponent(challenge);

      const picKey = `${opponent.identities[0].externalId}pic`;
      const buttPic = ChallengeUtils.addButtonPicture(picKey);

      const opponentTxt = opponent.identities[0].profile.displayName;
      const statusTxt = ChallengeUtils.getButtonStatusText(challenge);

      butt.addChild(buttPic);
      butt.addChild(ChallengeUtils.addButtonOpponentText(buttPic.width, opponentTxt));
      butt.addChild(ChallengeUtils.addButtonStatusText(buttPic.width, statusTxt));

      buttPic.scale.setTo(0.8);

      return butt;
    }

    static addChallengeButton(challenge, chalGroup, yLoc) {
      if (_.isNil(challenge)) { return; }

      try {
        chalGroup.add(ChallengeUtils.configureButton(challenge, yLoc));

        yLoc += 200 * scaleRatio;

        return yLoc;
      } catch (err) {
        console.error('Error addChallengeButton: %O ', err);
      }
    }

    static displayChallengeGroup(challenges, challengerGroup, yLoc) {
      _.castArray(challenges).forEach(challenge =>
        yLoc = ChallengeUtils.addChallengeButton(challenge, challengerGroup, yLoc)
      );
    }

    static challengeStart(challenge) {
      window.buttonSound();

      console.info('challengeStart for challenge: %O', challenge);

      if (challenge.status === 'finished') {
        app.game.world.setBounds(0, 0, app.game.width, app.game.height);
        app.game.state.start('challengeResults', true, false, challenge);
      } else if (challenge.status === 'declined') {
        alert('This Challenge Was Declined!');
      } else if (_.isNil(ChallengeUtils.getUser(challenge).score)) {
        app.menuSong.stop();

        app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
      } else if (_.isNil(ChallengeUtils.getOpponent(challenge).score)) {
        alert('Waiting For Opponent!');
      }
    }

  };
}());
