const express = require("express");
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 5000;
const path = require("path");
app.use(express.static("client"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(port, () => {
  console.log(`server started at port ${port}`);
});

// socket connection
const io = require("socket.io")(http);

const users = {};

io.on("connection", (socket) => {
  // send new connection msg
  socket.on("user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined-msg", name);
  });
  // listening sendMsg event form client
  socket.on("sendMsg", (msg) => {
    socket.broadcast.emit("broadcastMsg", msg);
  });

  // left chat
  socket.on("disconnect", () => {
    socket.broadcast.emit("left-chat", users[socket.id]);
  });
});
