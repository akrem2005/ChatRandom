const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove the user from the users object
    delete users[socket.id];
  });

  // Handle call initiation
  socket.on("call", ({ callerID, calleeID, room }) => {
    // Notify the callee about the incoming call
    io.to(room).emit("incomingCall", { callerID, room });
  });

  // Handle answering the call
  socket.on("answerCall", ({ callerID, answererID, room }) => {
    // Notify the caller that the call is answered
    io.to(room).emit("callAnswered", { answererID, room });
  });

  // Handle sending and receiving video stream
  socket.on("offer", (data) => {
    io.to(data.room).emit("offer", data);
  });

  socket.on("answer", (data) => {
    io.to(data.room).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    io.to(data.room).emit("ice-candidate", data.candidate);
  });

  // Handle joining a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    users[socket.id] = { room };
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
