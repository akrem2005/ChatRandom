const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public")); // Assuming your HTML file is in a 'public' folder

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("signal", (data) => {
    io.to(data.room).emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
