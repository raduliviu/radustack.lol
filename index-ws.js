const express = require('express');
const http = require('http');

const server = http.createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => {
  console.log('Server started on port 3000');
});

/** Begin websocket */
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log(`New client connected. Total clients: ${numClients}`);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to the WebSocket server!');
  }

  ws.on('close', () => {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log(`Client disconnected. Total clients: ${numClients}`);
  });
});

wss.broadcast = (data) => wss.clients.forEach((client) => client.send(data));

/** End websocket */
