app.menu = {}

app.menu.preload = function() {	

}

app.menu.create = function() {
	console.log('Menu State');
	app.game.state.start('level');
};