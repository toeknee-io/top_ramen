(function challengeUtilsIife({ app, scaleRatio, alert }) {
  window.ChallengeUtils = class ChallengeUtils {

    static getPlayerPropertyKey(challenge) {
      if (challenge.challenger && challenge.challenged && window.trApi.getUserId()) {
        return challenge.challenger.userId === window.trApi.getUserId() ?
          'challenger' : 'challenged';
      }
      throw new Error('Could not getPlayerPropertyKey for userId %s from challenge %O',
        window.trApi.getUserId(), challenge);
    }

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

    static isUserChallenger(challenger) {
      if (challenger && window.trApi.getUserId()) {
        return challenger.userId === window.trApi.getUserId();
      }
      throw new Error('Could not determine isUserChallenger for userId %s from challenger: %O',
        window.trApi.getUserId(), challenger);
    }

    static isUserChallenged(challenged) {
      if (challenged && window.trApi.getUserId()) {
        return challenged.userId === window.trApi.getUserId();
      }
      throw new Error('Could not determine isUserChallenged for userId %s from challenger: %O',
        window.trApi.getUserId(), challenged);
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
    static getButtonStatusText(
      {
        status, challenger, challenged, winner,
        challenged: { score: dScore },
        challenger: { score: rScore },
        challenged: { inviteStatus: ivStatus },
      },
      CCS = this.Constants.STATUS, CCIS = this.Constants.INVITE.STATUS,
      CCN = this.Constants.NEW, CCST = this.Constants.STARTED,
      uScore = this.isUserChallenger(challenger) ? rScore : dScore,
      oScore = this.isUserChallenged(challenged) ? rScore : dScore,
      isNew = status === CCS.NEW,
      isFinished = status === CCS.FINISHED,
      isAccepted = ivStatus === CCIS.ACCEPTED,
      isDeclined = ivStatus === CCIS.DECLINED
    ) {
      let statusTxt = CCN.BUTTONS.TEXT.STATUS.PENDING;

      if (isNew) {
        if (isAccepted) {
          const CCNB = CCN.BUTTONS;
          const CCSTB = CCST.BUTTONS;
          if (_.isNil(rScore) && _.isNil(oScore)) {
            statusTxt = CCNB.TEXT.STATUS.READY;
          } else {
            statusTxt = _.isNil(oScore) ? CCSTB.TEXT.STATUS.THEM : CCSTB.TEXT.STATUS.YOU;
          }
        }
      } else if (isFinished) {
        const CCF = this.Constants.FINISHED;
        statusTxt = isDeclined ? CCF.BUTTONS.TEXT.STATUS.DECLINED : CCF.BUTTONS.TEXT.STATUS.TIED;
        statusTxt = !isDeclined && (uScore > oScore) ?
          CCF.BUTTONS.TEXT.STATUS.WON : CCF.BUTTONS.TEXT.STATUS.LOST;
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

      const deleteButton = window.app.game.add.button(0, 50 * scaleRatio, 'delete', () => {
        const deleteGroup = window.app.game.add.group();
        deleteGroup.fixedToCamera = true;

        const lb = window.app.game.add.button(0, 0);
        lb.loadTexture('main', 'lightbox_bg');
        lb.width = window.app.game.width;
        lb.height = window.app.game.height;

        const declineText = window.app.game.add.bitmapText(window.app.game.world.centerX, 300, 'fnt-orange', 'do you want\nto delete \nthis challenge?');
        declineText.align = 'center';
        declineText.anchor.x = 0.5;
        declineText.scale.setTo(3 * window.scaleRatio);

        const yes = window.app.game.add.bitmapText(window.app.game.world.centerX, declineText.bottom + (200 * window.scaleRatio), 'fnt', 'yes');
        yes.anchor.x = 0.5;
        yes.scale.setTo(5 * window.scaleRatio);
        yes.inputEnabled = true;

        const no = window.app.game.add.bitmapText(window.app.game.world.centerX, yes.bottom + (175 * window.scaleRatio), 'fnt', 'no');
        no.anchor.x = 0.5;
        no.scale.setTo(5 * window.scaleRatio);
        no.inputEnabled = true;

        deleteGroup.add(lb);
        deleteGroup.add(declineText);
        deleteGroup.add(yes);
        deleteGroup.add(no);

        yes.events.onInputUp.add(() => {
          const playerKey = ChallengeUtils.getPlayerPropertyKey(challenge);
          const fn = playerKey === 'challenged' && challenge.status !== this.Constants.INVITE.STATUS.ACCEPTED ?
            'declineChallenge' : 'hideChallenge';

          window.trApi[fn](challenge)
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
      if (_.isEmpty(challenge)) { return yLoc; }

      try {
        if (!ChallengeUtils.getUser(challenge).hidden) {
          chalGroup.add(ChallengeUtils.configureButton(challenge, yLoc));
          yLoc += 200 * scaleRatio;
        }
      } catch (err) {
        alert(`Error addChallengeButton:${err.stack || err.message}`);
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

    static get Constants() {
      return window.TopRamenConstants.CHALLENGE;
    }

  };
}(window));
