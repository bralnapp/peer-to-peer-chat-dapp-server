const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "https://radenu.vercel.app",
    methods: ['GET', "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

