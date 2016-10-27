(function() {

  'use strict';

  window.ChallengeUtils = class ChallengeUtils {

    static getUser(challenge) {
      if (challenge.challenger && challenge.challenged && trApi.getUserId())
        return challenge.challenger.userId === trApi.getUserId() ?
          challenge.challenger : challenge.challenged;
      else
        throw new Error('Could not getChallengeUser for userId %s from challenge %O', trApi.getUserId(), challenge);
    }

    static getOpponent(challenge) {
      if (challenge.challenger && challenge.challenged && trApi.getUserId())
        return challenge.challenger.userId === trApi.getUserId() ?
          challenge.challenged : challenge.challenger;
      else
        throw new Error(`Could not getChallengeOpponent for userId %s from challenge %O`, trApi.getUserId(), challenge);
    }

    static initGroupTitles(bitmapTexts) {
      _.castArray(bitmapTexts)
        .forEach(bitmapText => {
          bitmapText.align = 'center';
          bitmapText.scale.setTo(scaleRatio * 3);
          bitmapText.anchor.x = 0.5;
        });
    }

    static getButtonDisplayStatus(challenge) {

      let userScore = ChallengeUtils.getUser(challenge).score;
      let opponent = ChallengeUtils.getOpponent(challenge);

      if (challenge.status !== 'finished')
        return _.isNil(userScore) && _.isNil(opponent.score) ?
          'Not Started' : (_.isNil(userScore) ? 'Your Turn' : 'Their Turn');
      else
        return challenge.winner === 'tied' ? 'Tied' :
                  (userScore > opponent.score ? 'You Won!' :
                    opponent.score > userScore ? 'You Lost' : 'wtf?!');

    }

    static getButtonPicture(picKey) {

      return app.game.cache.checkImageKey(picKey) ?
        app.game.add.image(30, 30, picKey) : app.game.add.image(30, 30, 'main', 'chef-holder');

    }

    static addChallengeButton(challenge, challengerGroup, picY) {

      if (_.isNil(challenge))
        return;

      try {

        let picKey = `${ChallengeUtils.getOpponent(challenge).identities[0].externalId}pic`;

        challengerGroup.add(
          ChallengeUtils.configureButton(
            challenge, picY,
            ChallengeUtils.getButtonPicture(picKey),
            ChallengeUtils.getButtonDisplayStatus(challenge))
        );

        picY += 200 * scaleRatio;

        return picY;

      } catch (err) {
        console.error('Error addOpenChallengeButton: %O ', err);
      }

    }

    static getButtonText(width, displayName) {
      return app.game.add.text(width + 20, 30, displayName, {
        font: 'bold 60px Arial',
        fill: '#fff',
        align: "right",
      });
    }

    static getButtonStatus(width, status) {
      return app.game.add.text(width + 20, 120, status, {
        font: 'bold 40px Arial',
        fill: '#fff',
        align: "right",
      });
    }

    static configureButton(challenge, picY, buttPic, status) {

      let butt = app.game.add.button(0, picY);

      butt.loadTexture('main', 'item_bg');

      butt.onInputDown.add(() => {

        let yLoc = app.game.world.y;

        butt.onInputUp.add(() => {

          if (yLoc === app.game.world.y) {

            ChallengeUtils.challengeStart(challenge);

          }

        }, challenge);

      });

      butt.scale.setTo(0.8 * scaleRatio);
      butt.centerX = app.game.world.centerX;

      let buttText = ChallengeUtils.getButtonText(buttPic.width, ChallengeUtils.getOpponent(challenge).identities[0].profile.displayName);
      let buttStatus = ChallengeUtils.getButtonStatus(buttPic.width, status);

      butt.addChild(buttText);
      butt.addChild(buttPic);

      butt.addChild(buttStatus);

      buttPic.scale.setTo(0.8);

      return butt;

    }

    static displayChallenges(challenges, challengerGroup, picY) {
      _.castArray(challenges).forEach(challenge =>
        picY = ChallengeUtils.addChallengeButton(challenge, challengerGroup, picY)
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

})();