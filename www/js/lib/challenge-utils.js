(function challengeUtilsIife({ app, scaleRatio, tru }) {
  window.ChallengeUtils = class ChallengeUtils {

    static getPlayerPropertyKey(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          'challenger' : 'challenged';
      }
      throw new Error('Could not getPlayerPropertyKey for userId %s from challenge %O',
        window.trApi.getUserId(), challenge);
    }

    static getUser({ challenger, challenged }) {
      if (challenger && challenged && window.trApi.getUserId()) {
        return challenger.userId === window.trApi.getUserId() ?
          challenger : challenged;
      }
      throw new Error('Could not getUser for userId %s from challenger/challenged: %O',
        window.trApi.getUserId(), { challenger, challenged });
    }

    static getOpponent(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          challenge.challenged : challenge.challenger;
      }
      throw new Error('Could not getOpponent for userId %s from challenge %O',
        window.trApi.getUserId(), challenge);
    }

    static isUserChallenger(challenger, userId = window.trApi.getUserId()) {
      if (this.isChallengerObj(challenger) && userId) { return challenger.userId === userId; }
      throw new Error('Could not determine isUserChallenger for userId %s from challenger: %O',
        userId, challenger);
    }

    static isUserChallenged(challenged, userId = window.trApi.getUserId()) {
      if (this.isChallengedObj(challenged) && userId) { return challenged.userId === userId; }
      throw new Error('Could not determine isUserChallenged for userId %s from challenger: %O',
        userId, challenged);
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
    /* eslint-disable prefer-rest-params */
    static getButtonStatusText(challenge) {
      const [CCSTB, CCFB] = [this.Constants.STARTED.BUTTONS, this.Constants.FINISHED.BUTTONS];

      const uScore = this.getUser(challenge).score;
      const oScore = this.getOpponent(challenge).score;

      let statusTxt = null;

      if (ChallengeUtils.isNewChallenge(challenge)) {
        statusTxt = this.Constants.NEW.BUTTONS.TEXT.STATUS.READY;
      } else if (ChallengeUtils.isDeclinedChallenge(challenge)) {
        statusTxt = CCFB.TEXT.STATUS.DECLINED;
      } else if (ChallengeUtils.isFinishedChallenge(challenge)) {
        if (!_.isNil(challenge.winner)) {
          if (uScore !== oScore) {
            statusTxt = uScore > oScore ? CCFB.TEXT.STATUS.WON : CCFB.TEXT.STATUS.LOST;
          } else if (uScore === oScore) {
            statusTxt = CCFB.TEXT.STATUS.TIED;
          }
        }
      }

      if (_.isNil(statusTxt)) {
        statusTxt = _.isNil(oScore) ? CCSTB.TEXT.STATUS.THEM : CCSTB.TEXT.STATUS.YOU;
      }

      return statusTxt;
    }
    /* eslint-enable prefer-rest-params */
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
            this.challengeStart(challenge);
          }
        }, challenge);
      });

      butt.scale.setTo(0.8 * scaleRatio);
      butt.centerX = app.game.world.centerX;

      const opponent = this.getOpponent(challenge);

      const picKey = `${opponent.identities[0].externalId}pic`;
      const buttPic = ChallengeUtils.addButtonPicture(picKey);

      const opponentTxt = opponent.identities[0].profile.displayName;
      const statusTxt = ChallengeUtils.getButtonStatusText(challenge);

      butt.addChild(buttPic);
      butt.addChild(ChallengeUtils.addButtonOpponentText(buttPic.width, opponentTxt));
      butt.addChild(ChallengeUtils.addButtonStatusText(buttPic.width, statusTxt));

      buttPic.scale.setTo(0.8);

      const deleteButton = window.app.game.add.button(0, 50 * scaleRatio, 'delete', () => {
        const deleteGroup = window.app.game.add.group();
        deleteGroup.fixedToCamera = true;

        const lb = window.app.game.add.button(0, 0);
        lb.loadTexture('main', 'lightbox_bg');
        lb.width = window.app.game.width;
        lb.height = window.app.game.height;

        const declineText = window.app.game.add.bitmapText(window.app.game.world.centerX,
          300, 'fnt-orange', 'do you want\nto delete \nthis challenge?');
        declineText.align = 'center';
        declineText.anchor.x = 0.5;
        declineText.scale.setTo(3 * window.scaleRatio);

        const yes = window.app.game.add.bitmapText(window.app.game.world.centerX,
          declineText.bottom + (200 * window.scaleRatio), 'fnt', 'yes');
        yes.anchor.x = 0.5;
        yes.scale.setTo(5 * window.scaleRatio);
        yes.inputEnabled = true;

        const no = window.app.game.add.bitmapText(window.app.game.world.centerX,
          yes.bottom + (175 * window.scaleRatio), 'fnt', 'no');
        no.anchor.x = 0.5;
        no.scale.setTo(5 * window.scaleRatio);
        no.inputEnabled = true;

        deleteGroup.add(lb);
        deleteGroup.add(declineText);
        deleteGroup.add(yes);
        deleteGroup.add(no);

        yes.events.onInputUp.add(() => {
          const isChallenged = ChallengeUtils.isUserChallenged(challenge.challenged);
          const accepted = ChallengeUtils.isAcceptedChallenge(challenge);
          const fn = isChallenged && !accepted ? 'declineChallenge' : 'hideChallenge';

          window.trApi[fn](challenge.id)
            .finally(() => window.app.game.state.restart());
        });

        no.events.onInputUp.add(() => {
          deleteGroup.destroy();
        });
      });

      butt.addChild(deleteButton);
      deleteButton.scale.setTo(0.6 * window.scaleRatio);

      deleteButton.x = butt.right - (300 * window.scaleRatio);

      return butt;
    }

    /* eslint-disable no-param-reassign */
    static addChallengeButton(challenge, chalGroup, yLoc) {
      try {
        if (!_.isEmpty(challenge) && !this.getUser(challenge).hidden) {
          console.debug('adding challenge button for challenge: %O', challenge);
          chalGroup.add(this.configureButton(challenge, yLoc));
          yLoc += 200 * scaleRatio;
        }
      } catch (err) {
        window.tru.error(`Error addChallengeButton:${err.stack || err.message}`);
      }

      return yLoc;
    }

    static displayChallengeGroup(challenges, challengerGroup, yLoc) {
      _.castArray(challenges).forEach((challenge) => {
        yLoc = this.addChallengeButton(challenge, challengerGroup, yLoc);
      });
      return yLoc;
    }
    /* eslint-enable no-param-reassign */

    static challengeStart(challenge) {
      window.buttonSound();

      console.debug('challengeStart for challenge: %O', challenge);

      if (challenge.status === 'finished') {
        app.game.world.setBounds(0, 0, app.game.width, app.game.height);
        app.game.state.start('challengeResults', true, false, challenge);
      } else if (challenge.inviteStatus === 'declined') {
        window.alert('This Challenge Was Declined!');
      } else if (_.isNil(this.getUser(challenge).score)) {
        app.menuSong.stop();
        app.game.state.start('level', true, false, challenge);
      } else if (_.isNil(this.getOpponent(challenge).score)) {
        window.alert('Waiting For Opponent!');
      }
    }

    static isNewChallenge({ status }) {
      return status === this.Constants.STATUS.NEW;
    }

    static isStartedChallenge({ status }) {
      return status === this.Constants.STATUS.STARTED;
    }


    static isAcceptedChallenge({ challenged: { inviteStatus } }) {
      return inviteStatus === this.Constants.INVITE.STATUS.ACCEPTED;
    }

    static isDeclinedChallenge({ challenged: { inviteStatus } }) {
      return inviteStatus === this.Constants.INVITE.STATUS.DECLINED;
    }

    static isFinishedChallenge({ status }) {
      return status === this.Constants.STATUS.FINISHED;
    }

    static get Constants() {
      return window.TopRamenConstants.CHALLENGE;
    }

    static isChallengerObj(challenger) {
      return challenger && !tru.hasOwnProp(challenger, 'inviteStatus') && tru.hasOwnProp(challenger, 'identities');
    }

    static isChallengedObj(challenged) {
      return challenged && tru.hasOwnProp(challenged, 'inviteStatus') && tru.hasOwnProp(challenged, 'identities');
    }

  };
}(window));
