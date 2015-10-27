/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	new: function(req, res){
		PermissionCheckService.checkLevel(req, 2)
		.then(function(user){
			if (!user) return res.forbidden();
			res.view({layout:null});
		});
	},

	me: function(req, res){
		res.redirect('/user/edit/'+req.session.User.id);
	},

	changePassword: function(req, res, next){
		var bcrypt = require('bcrypt');
		User.findOne(req.param('id'), function(err, user){
			if (err) return next(err);
			if (user){
				if (bcrypt.compareSync(req.param('oldpassword'), user.encryptedPassword) == true || req.session.admin == true) {
					bcrypt.hash(req.param('password'), 10, function(err, encryptedPassword){
						if (err) return next(err);
						User.update(req.param('id'), { encryptedPassword: encryptedPassword }, function (err, user2){
							if (err) {
								res.send(500);
							}else{
								User.publishUpdate(req.param('id'),user2[0]);
								res.json({oldpassword:'1', password:'1', confirmPassword:'1'});
							}
						});
					});
				}else{
					res.redirect('/user/edit/'+req.param('id'));
				}
			}
		});
	},


	// update: function(req, res, next){
	// 	var userObject = req.params.all();
	// 	User.findOne(userObject.id, function(err, user){
	// 		if (err) return next(err);
	// 		if (user){
	// 				User.update(userObject.id, userObject, function (err, user2){
	// 					if (err) {
	// 						res.send(500);
	// 					}else{
	// 						setTimeout(function (argument) {
	// 							// body...
	// 						User.publishUpdate(userObject.id,user2[0]);
	// 						res.json(user2[0]);
	// 						}, 3000);
	// 					}
	// 				});
	// 		}else{
	// 			res.redirect('user/list');
	// 		}
	// 	});
	// },

	show: function(req, res, next){
		
		
		User.findOne(req.param('id'), function(err, user){
			if (err) return next(err);
			res.view({
				user: user
			});
		});
	},

	xxx: function(req, res, next){
		
		
		User.findOne(req.param('id'), function(err, user){
			if (err) return next(err);
			res.view({
				user: user,
				abracadabra:'abracadabra'
			});
		});
	},

	edit: function(req, res, next){
		
		
		User.findOne(req.param('id'), function(err, user){
			if (err) return next(err);
			if (!user) return next('Brak użytkownika - edit');
			setTimeout(function(){
				res.view({
					user: user,
					layout: null
				});
			}, 1000);
		});
	},

	destroy: function(req, res, next){
		PermissionCheckService.checkLevel(req, 3)
		.then(function(user){
			if (!user) return res.forbidden();

			User.findOne(req.param('id'), function(err, user){
				if (err) return next(err);
				if (!user) return next('Brak użytkownika - destroy');
				User.destroy(req.param('id'), function(err){
					if (err) return next(err);

					User.publishUpdate(user.id, {
		                name: user.fullname,
		                action: ' has been destroyed.'
		            });

		            // Let other sockets know that the user instance was destroyed.
		            User.publishDestroy(user.id);
				});
				res.redirect('/user/list');
			});
		});
	},
	list: function(req, res, next){
		User.find(function(err,users){
			if (err) return next(err);
			if (!users) return next();
			res.view({
				users: users,
				moment: sails.moment,
				layout: null
			});
		});
	},
	subscribe: function  (req, res) {
		// User.watch(req.socket);
		User.find(function foundUsers (err, users) {
			User.watch(req.socket);
			User.subscribe(req.socket, users);
			res.send(200);
		});
	}
};
