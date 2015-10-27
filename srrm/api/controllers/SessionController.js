/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcrypt');
module.exports = {
	
	create: function(req, res, next){
		User.findOneByEmail(req.param('email'), function(err, user){
			if (err) return next(err);
			if (user){
				if (bcrypt.compareSync(req.param('password'), user.encryptedPassword) == true){
					console.log('password ok');
					req.session.authenticated = true;
					req.session.User = user;
					res.json(user);
				}
			}else{
				res.status(403);
				res.send('wrong creditientals');
			}
		});
	},
	destroy: function(req, res, next){
		req.session.destroy();
		res.redirect('/');
	}
};

