/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */


module.exports.bootstrap = function(cb) {
	sails.moment = require('moment');
	sails.amqp = require('amqplib/callback_api');

	sails.controllers.rabbit.subsribeRabbitClientQueues();
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

console.tlg = function(message){
	var moment = (new Date).toLocaleString() + '.' + (new Date).getMilliseconds();
	sails.log("AT "+moment+":");
	sails.log(JSON.stringify(message));
}