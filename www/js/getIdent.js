function getIdentity(data,provider) {
	$.get(
	  "http://www.toeknee.io:3000/api/users/" + data.userId + "/identities"
	).done(function(user) {
		var user = [user][0][0];
		if (user.provider === 'facebook') {
			facebook = true;
			console.log('facebook');
			var token = user.credentials.accessToken;
			userName = user.profile.displayName;
			userPic = 'https://graph.facebook.com/me/picture?access_token=' + token + '&type=large';
			userFBFriends = $.get('https://graph.facebook.com/me/friends?access_token=' + token);
			app.game.state.restart();
		}
	}).fail(function(err) {
	  console.error("failed: " + err.message);
	});
}