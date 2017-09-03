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

	ws.on('message', function(message) {
		console.log('incoming data: %s\n', message);
		data = JSON.parse(message);
		console.log('type of data: %s', data.type);
		console.log('trying send to %s..', data.to);
		clients[data.to].send(message);
	});

	ws.send(JSON.stringify({ "type" : "id", "id" : id }));
});

server.listen(80, function() {
	console.log('Listening on %d', server.address().port);
});
