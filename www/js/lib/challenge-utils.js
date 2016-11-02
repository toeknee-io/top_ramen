(function challengeUtilsIife({ app, scaleRatio }) {
  window.ChallengeUtils = class ChallengeUtils {

    static getUser(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenger : challenge.challenged;
      }
      throw new Error('Could not getChallengeUser for userId %s from challenge %O',
        window.trApi.getUserId(), challenge);
    }

    static getOpponent(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenged : challenge.challenger;
      }
      throw new Error('Could not getChallengeOpponent for userId %s from challenge %O',
        window.trApi.getUserId(), challenge);
    }
    /* eslint-disable no-param-reassign */
    static initGroupTitles(bitmapTexts) {
      _.castArray(bitmapTexts)
        .forEach((bitmapText) => {
          bitmapText.align = 'center';
          bitmapText.scale.setTo(scaleRatio * 3);
          bitmapText.anchor.x = 0.5;
        });
    }
    /* eslint-enable no-param-reassign */
    static getButtonStatusText(challenge) {
      const userScore = ChallengeUtils.getUser(challenge).score;
      const opponentScore = ChallengeUtils.getOpponent(challenge).score;

      let statusTxt = 'wtf?!';

      if (challenge.inviteStatus === 'pending') {
        statusTxt = 'Pending';
      } else if (challenge.status !== 'finished') {
        if (challenge.status === 'not_started') {
          statusTxt = 'Not Started';
        } else if (_.isNil(userScore)) {
          statusTxt = 'Your Turn';
        } else {
          statusTxt = 'Their Turn';
        }
      } else if (challenge.status === 'finished') {
        if (challenge.winner === 'tied') {
          statusTxt = 'Tied';
        } else if (userScore > opponentScore) {
          statusTxt = 'You Won!';
        } else if (opponentScore > userScore) {
          statusTxt = 'You Lost';
        }
      }

      return statusTxt;
    }

    static addButtonPicture(picKey) {
      return app.game.cache.checkImageKey(picKey) ?
        app.game.add.image(30, 30, picKey) :
        app.game.add.image(30, 30, 'main', 'chef-holder');
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
        const yWorld = app.game.world.y;

        butt.onInputUp.add(() => {
          if (yWorld === app.game.world.y) {
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

      if (challenge.status === 'finished') {
        const deleteButton = app.game.add.button(0, 70 * scaleRatio, 'delete', () => {
          window.trApi.hideChallenge(challenge);
          butt.destroy();
        });

        butt.addChild(deleteButton);
        deleteButton.scale.setTo(0.6 * scaleRatio);

        deleteButton.x = butt.right - (300 * scaleRatio);
      }

      return butt;
    }

    /* eslint-disable no-param-reassign */
    static addChallengeButton(challenge, chalGroup, yLoc) {
      if (_.isNil(challenge)) { return yLoc; }

      try {
        if (!challenge.hidden) {
          chalGroup.add(ChallengeUtils.configureButton(challenge, yLoc));
          yLoc += 200 * scaleRatio;
        }
      } catch (err) {
        console.error('Error addChallengeButton: %O ', err);
      }

      return yLoc;
    }

    static displayChallengeGroup(challenges, challengerGroup, yLoc) {
      _.castArray(challenges).forEach((challenge) => {
        if (!challenge.hidden) {
          yLoc = ChallengeUtils.addChallengeButton(challenge, challengerGroup, yLoc);
        }
        return yLoc;
      });
    }
    /* eslint-enable no-param-reassign */

    static challengeStart(challenge) {
      window.buttonSound();

      console.info('challengeStart for challenge: %O', challenge);

      if (challenge.status === 'finished') {
        app.game.world.setBounds(0, 0, app.game.width, app.game.height);
        app.game.state.start('challengeResults', true, false, challenge);
      } else if (challenge.inviteStatus === 'declined') {
        window.alert('This Challenge Was Declined!');
      } else if (_.isNil(ChallengeUtils.getUser(challenge).score)) {
        app.menuSong.stop();
        app.game.state.start('level', true, false, challenge.id, challenge.ramenId);
      } else if (_.isNil(ChallengeUtils.getOpponent(challenge).score)) {
        window.alert('Waiting For Opponent!');
      }
    }

  };
}(window));
