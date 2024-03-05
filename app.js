const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid"); // to generate unique room IDs

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  const roomID = uuidv4(); // generate a unique room ID
  res.render("index", { RoomId: roomID });
});

io.on("connection", (socket) => {
  socket.on("newUser", (id) => {
    socket.join("/");
    io.to("/").emit("userJoined", id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
