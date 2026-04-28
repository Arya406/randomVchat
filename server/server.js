const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let queue = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("start", () => {
    console.log("Start:", socket.id);

    // remove duplicates
    queue = queue.filter((s) => s.id !== socket.id);

    let partner = null;

    while (queue.length > 0) {
      const candidate = queue.shift();

      if (candidate.id !== socket.id) {
        partner = candidate;
        break;
      }
    }

    if (partner) {
      socket.partner = partner;
      partner.partner = socket;

      socket.emit("matched", { isCaller: true });
      partner.emit("matched", { isCaller: false });

      console.log("Matched:", socket.id, partner.id);
    } else {
      queue.push(socket);
      console.log("Waiting:", socket.id);
    }
  });

  socket.on("signal", (data) => {
    if (socket.partner) {
      socket.partner.emit("signal", data);
    }
  });

  socket.on("next", () => {
    console.log("Next:", socket.id);

    if (socket.partner) {
      socket.partner.emit("partner-disconnected");
      socket.partner.partner = null;
    }

    socket.partner = null;

    queue = queue.filter((s) => s.id !== socket.id);

    setTimeout(() => {
      if (queue.length > 0) {
        const partner = queue.shift();

        if (partner.id !== socket.id) {
          socket.partner = partner;
          partner.partner = socket;

          socket.emit("matched", { isCaller: true });
          partner.emit("matched", { isCaller: false });

          console.log("Re-matched:", socket.id, partner.id);
        } else {
          queue.push(socket);
        }
      } else {
        queue.push(socket);
      }
    }, 300);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    if (socket.partner) {
      socket.partner.emit("partner-disconnected");
      socket.partner.partner = null;
    }

    queue = queue.filter((s) => s.id !== socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});