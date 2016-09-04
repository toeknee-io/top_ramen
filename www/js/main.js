app.game.state.add('login', app.login);
app.game.state.add('boot', app.boot);
app.game.state.add('menu', app.menu);
app.game.state.add('level', app.level);
app.game.state.start('boot');