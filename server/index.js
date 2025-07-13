const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let waitingPlayer = null;

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  if (waitingPlayer) {
    const room = `room-${waitingPlayer.id}-${socket.id}`;
    socket.join(room);
    waitingPlayer.join(room);

    io.to(room).emit("startGame", {
      room,
      players: [waitingPlayer.id, socket.id]
    });

    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
    socket.emit("waiting", "Waiting for another player...");
  }

  socket.on("answer", ({ room, playerId }) => {
    io.to(room).emit("winner", playerId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
