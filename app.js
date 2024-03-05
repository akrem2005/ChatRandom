const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle joining a room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  // Handle signaling data
  socket.on("signal", (data) => {
    io.to(data.room).emit("signal", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
