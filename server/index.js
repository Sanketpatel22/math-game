const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let waitingPlayer = null;

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  if (waitingPlayer) {
    const player1 = waitingPlayer;
    const player2 = socket;

    player1.emit('startGame', { opponentId: player2.id });
    player2.emit('startGame', { opponentId: player1.id });

    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
    socket.emit('waitingForPlayer');
  }

  socket.on('disconnect', () => {
    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


