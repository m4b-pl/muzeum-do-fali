var amqp = require('amqplib/callback_api');
var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'HeartBeat';
    var msg = "Hello World!";

    ch.assertQueue(q, {durable: true});
    for (var i = 1000 - 1; i > 0; i--) {
    	ch.sendToQueue(q, new Buffer(i.toString()+"-"+randomString(32, characters)), {persistent: true});
    };
    console.log(" [x] Sent ");
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

