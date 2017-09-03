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
	id = req.headers['sec-websocket-key'].substr(0, 16);
	clients[id] = ws;
	console.log('new connection established %s', id);

	ws.on('close', function(event) {
		delete clients[id];
		console.log('connection closed %s', id);
	});

	ws.on('message', function(data) {
		console.log('incoming data from %s: %s\n', id, data);
	});

	ws.send(id);
});

server.listen(80, function() {
	console.log('Listening on %d', server.address().port);
});
