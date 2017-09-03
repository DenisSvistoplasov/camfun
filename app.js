const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

var clients={};

const server = http.createServer( function(req, res) {
	console.log('Request URL: %s', req.url);
	console.log('Request header: %s', JSON.stringify(req.headers));
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
	var id = req.headers['sec-websocket-key'].substr(0, 16);
	var message = JSON.stringify({ "type" : "id", "id" : id });
	ws.send(message);
	clients[id] = ws;
	console.log('Connection established: %s', id);
	console.log('Keep alive %d connection(s)', Object.keys(clients).length);

	ws.on('close', function(event) {
		delete clients[id];
		console.log('Connection closed: %s', id);
		console.log('Keep alive %d connection(s)', Object.keys(clients).length);
	});

	ws.on('message', function(message) {
		destination = JSON.parse(message).to;
		type = JSON.parse(message).type;
		console.log('Data forwarded from %s to %s, type: %s', id, destination, type);
		clients[destination].send(message);
	});
});

server.listen(80, function() {
	console.log('Listening on %d', server.address().port);
});
