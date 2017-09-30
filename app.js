const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

var clients = {};

const server = http.createServer( function(req, res) {
	fs.readFile('index.html', null, function(error, data) {
		if (error) {
			res.writeHead(404);
			res.write('File not found');
		} else {
			res.writeHead(200, { 'Content-type': 'text/html' });
			res.write(data);
		};
		res.end();
	});
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function(ws, req) {
	var id = req.headers['sec-websocket-key'].substr(0, 6);
	var message = JSON.stringify({ "type" : "id", "id" : id });
	ws.send(message);
	clients[id] = ws;
	console.log('%s Connection established: %s', Date.now(), id);
	console.log('%s Keep alive %d connection(s)', Date.now(), Object.keys(clients).length);

	ws.on('close', function(event) {
		delete clients[id];
		console.log('%s Connection closed: %s', Date.now(), id);
		console.log('%s Keep alive %d connection(s)', Date.now(), Object.keys(clients).length);
	});

	ws.on('message', function(message) {
		destination = JSON.parse(message).to;
		if (Object.keys(clients).indexOf(destination) + 1) {
			type = JSON.parse(message).type;
			clients[destination].send(message);
			console.log('%s Data forwarded from %s to %s, type: %s', Date.now(), id, destination, type);
		} else {
			message = JSON.stringify({ "type" : "error", "error" : "remote peer id not correct" });
			ws.send(message);
			console.log('%s Wrong destination', Date.now());
		}
	});
});

server.listen(80, function() {
	console.log('%s Listening on %d', Date.now(), server.address().port);
});
