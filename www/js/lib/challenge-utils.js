(function challengeUtilsIife() {
  window.ChallengeUtils = class ChallengeUtils {

    static getUser(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenger : challenge.challenged;
      }
      throw new Error('Could not getChallengeUser for userId %s from challenge %O', window.trApi.getUserId(), challenge);
    }

    static getOpponent(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenged : challenge.challenger;
      }
      throw new Error('Could not getChallengeOpponent for userId %s from challenge %O', window.trApi.getUserId(), challenge);
    }
    /* eslint-disable no-param-reassign */
    static initGroupTitles(bitmapTexts) {
      _.castArray(bitmapTexts)
        .forEach((bitmapText) => {
          bitmapText.align = 'center';
          bitmapText.scale.setTo(window.scaleRatio * 3);
          bitmapText.anchor.x = 0.5;
        });
    }

    static getButtonStatusText(challenge) {
      let statusTxt = 'wtf?!';

      const userScore = ChallengeUtils.getUser(challenge).score;
      const opponent = ChallengeUtils.getOpponent(challenge);

      if (challenge.status !== 'finished') {
        if (_.isNil(userScore) && _.isNil(opponent.score)) {
          statusTxt = 'Not Started';
        } else if (_.isNil(userScore)) {
          statusTxt = 'Your Turn';
        } else {
          statusTxt = 'Their Turn';
        }
      } else if (challenge.winner === 'tied') {
        statusTxt = 'Tied';
      } else if (userScore > opponent.score) {
        statusTxt = 'You Won!';
      } else if (opponent.score > userScore) {
        statusTxt = 'You Lost';
      }

      return statusTxt;
    }
    /* eslint-enable no-param-reassign */

    static addButtonPicture(picKey) {
      return window.app.game.cache.checkImageKey(picKey) ?
        window.app.game.add.image(30, 30, picKey) : window.app.game.add.image(30, 30, 'main', 'chef-holder');
    }

    static addButtonOpponentText(width, displayName) {
      return window.app.game.add.text(width + 20, 30, displayName, {
        font: 'bold 60px Arial',
        fill: '#fff',
        align: 'right',
      });
    }

    static addButtonStatusText(width, status) {
      return window.app.game.add.text(width + 20, 120, status, {
        font: 'bold 40px Arial',
        fill: '#fff',
        align: 'right',
      });
    }

    static configureButton(challenge, yLoc) {
      const butt = window.app.game.add.button(0, yLoc);

      butt.loadTexture('main', 'item_bg');

      butt.onInputDown.add(() => {
        const yWorld = window.app.game.world.y;

        butt.onInputUp.add(() => {
          if (yWorld === window.app.game.world.y) {
            ChallengeUtils.challengeStart(challenge);
          }
        }, challenge);
      });

      butt.scale.setTo(0.8 * window.scaleRatio);
      butt.centerX = window.app.game.world.centerX;

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

    /* eslint-disable no-param-reassign */
    static addChallengeButton(challenge, chalGroup, yLoc) {
      if (_.isNil(challenge)) { return yLoc; }

      try {
        chalGroup.add(ChallengeUtils.configureButton(challenge, yLoc));

        yLoc += 200 * window.scaleRatio;
      } catch (err) {
        console.error('Error addChallengeButton: %O ', err);
      }

      return yLoc;
    }

    static displayChallengeGroup(challenges, challengerGroup, yLoc) {
      _.castArray(challenges).forEach((challenge) => {
        yLoc = ChallengeUtils.addChallengeButton(challenge, challengerGroup, yLoc);
        return yLoc;
      });
    }
    /* eslint-enable no-param-reassign */

    static challengeStart(challenge) {
      window.buttonSound();

      console.info('challengeStart for challenge: %O', challenge);

      if (challenge.status === 'finished') {
        window.app.game.world.setBounds(0, 0, window.app.game.width, window.app.game.height);
        window.app.game.state.start('challengeResults', true, false, challenge);
      } else if (challenge.status === 'declined') {
        alert('This Challenge Was Declined!');
      } else if (_.isNil(ChallengeUtils.getUser(challenge).score)) {
        window.app.menuSong.stop();

        window.app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
      } else if (_.isNil(ChallengeUtils.getOpponent(challenge).score)) {
        alert('Waiting For Opponent!');
      }
    }

  };
}());
