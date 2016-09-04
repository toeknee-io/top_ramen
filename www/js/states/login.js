app.login = {}

app.login.preload = function() {

}

app.login.create = function() {
	console.log('Login State');
	app.game.state.start('menu');
}