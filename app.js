var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections =[];

server.listen(process.env.PORT || 80);
console.log('Server running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/offer.html');
});

app.get('/offer.html', function(req, res){
	res.sendFile(__dirname + '/offer.html');
});

app.get('/answer.html', function(req, res){
	res.sendFile(__dirname + '/answer.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	// Send Message
	socket.on('iceCandidate', function(data){
		io.sockets.emit('iceCandidate', data);
		console.log('iceCandidate: %s', data);
	});
});
