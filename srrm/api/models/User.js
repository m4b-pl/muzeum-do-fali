/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
module.exports = {

	schema : true,

	attributes: {
		name:{
			type:"string",
			required: true
		},
		
		email: {
			type:"string",
			email: true,
			required: true,
			unique: true
		},
		encryptedPassword: {
			type:"string"
		},
		level: {
			type:"integer",
			required: false,
		},
		nick: {
			type:"string",
			required: false,
		}
		
	},
	beforeCreate: function (values, next) {
		values.level = 1;
		if (!values.password || values.password != values.confirmPassword){
  			return next({err:{
  				invalidAttributes:'Hasła się nie zgadzają'
  			}});
  		}
		bcrypt.hash(values.password, 10, function(err, encryptedPassword){
			if (err) return next(err);
			values.encryptedPassword = encryptedPassword;
			next();
		});
	},

	// beforeUpdate: function(values, next){
	// 	bcrypt.hash(values.password, 10, function(err, encryptedPassword){
	// 		if (err) return next(err);
	// 		values.encryptedPassword = encryptedPassword;
	// 		next();
	// 	});
	// }
	
	
};

