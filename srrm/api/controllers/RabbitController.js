module.exports = {
  subsribeHeartBeat: function () {
  	sails.amqp.connect('amqp://localhost', function(err, conn) {
  		createWorker(conn);
  	});
  },
  bye: function (req, res) {
    return false;
  },

  subsribeRabbitClientQueues: function () {
  	sails.controllers.rabbit.subsribeHeartBeat();
  }

};

function consumeHeartBeat(message){
	console.tlg("[x] Received " + message.content.toString());
}

var parsing = 0;

function createWorker(conn){
	conn.createChannel(function(err, ch) {
		var q = 'HeartBeat';

		ch.assertQueue(q, {durable: true});
		ch.prefetch(1);
		console.tlg("[*] Listening as a worker for " + q);
		ch.consume(q, function(msg) {
			var secs = 100;
			if (parsing == 0){
				parsing = 1;
				console.tlg(msg.content.toString());
			}else if (msg.content.toString().substring(0, 2) == '1-'){
				parsing = 0;
				console.tlg(msg.content.toString());
			}else{
				// console.tlg(msg.content.toString());

			}


			setTimeout(function() {
				// console.tlg("[x] Done " + msg.content.toString() + " in " + secs + " seconds");
				ch.ack(msg);
			}, secs);
		}, {noAck: false});
	});
}