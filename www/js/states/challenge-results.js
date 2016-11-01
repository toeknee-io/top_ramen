(function challengeResultsIife() {
  const app = window.app;
  const scaleRatio = window.scaleRatio;

  app.challengeResults = {};

  app.challengeResults.init = function challengeResultsInit(challenge) {
    app.challengeResults.challengeData = challenge;
  };

  app.challengeResults.create = function challengeResultsCreate() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    const bg = app.game.add.image(0, 0, 'gameover_bg');

    bg.scale.setTo(2.05 * scaleRatio);
    bg.x = app.game.world.centerX;
    bg.anchor.x = 0.5;
    bg.y = app.game.world.centerY;
    bg.anchor.y = 0.5;

    const backButton = app.game.add.button(30, 30, '', window.goBack);
    backButton.loadTexture('main', 'back');
    backButton.scale.setTo(scaleRatio);

    let resultText = '';

    if (app.challengeResults.challengeData.winner === window.localStorage.userId) {
      resultText = 'you won!';
    } else if (app.challengeResults.challengeData.winner === 'tied') {
      resultText = 'tied!';
    } else {
      resultText = 'you lost';
    }

    const challengerScore = app.challengeResults.challengeData.challenger.score;
    const challengedScore = app.challengeResults.challengeData.challenged.score;

    let yourScore;
    let theirScore;
    let theirId;

    if (app.challengeResults.challengeData.challenger.userId === window.localStorage.getItem('userId')) {
      yourScore = challengerScore;
      theirScore = challengedScore;
      theirId = app.challengeResults.challengeData.challenged.userId;
    } else {
      yourScore = challengedScore;
      theirScore = challengerScore;
      theirId = app.challengeResults.challengeData.challenger.userId;
    }

    const welcomeText = app.game.add.bitmapText(app.game.world.centerX, 400 * scaleRatio, 'fnt-orange', resultText);
    welcomeText.scale.setTo(scaleRatio * 5);
    welcomeText.anchor.x = 0.5;

    const yourScoreText = app.game.add.bitmapText(app.game.world.centerX, 800 * scaleRatio, 'fnt', `your score:\n${yourScore}`);
    yourScoreText.align = 'center';
    yourScoreText.scale.setTo(scaleRatio * 3);
    yourScoreText.anchor.x = 0.5;

    const theirScoreText = app.game.add.bitmapText(app.game.world.centerX, 1200 * scaleRatio, 'fnt', `their score:\n${theirScore}`);
    theirScoreText.align = 'center';
    theirScoreText.scale.setTo(scaleRatio * 3);
    theirScoreText.anchor.x = 0.5;

    const rematchButton = app.game.add.button(app.game.world.centerX, 1700 * scaleRatio, '', () => {
      window.trApi.postChallenge(theirId)
        .then(data => console.log(`Rematch! : ${data}`))
        .catch(err => console.error(`Failed because: ${err.responseJSON.error.message}`));
    });
    rematchButton.loadTexture('main', 'rematch');
    rematchButton.anchor.x = 0.5;
  };
}());
