app.game.state.add('boot', app.boot);
app.game.state.add('menu', app.menu);
app.game.state.add('challenges', app.challenges);
app.game.state.add('challenge', app.challenge);
app.game.state.add('level', app.level);
app.game.state.add('game-over', app.gameover);
app.game.state.add('challengeResults', app.challengeResults);
app.game.state.start('boot');

function goHome() {
	app.game.world.setBounds(0, 0, app.game.width, app.game.height);
	app.game.kineticScrolling.stop();
	app.game.state.clearCurrentState();
	app.game.state.start('menu');
}