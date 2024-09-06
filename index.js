const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "http://creem:8888"
	}
});

const connectedClients = new Map();

httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});

io.on("connection", (socket) => {
	socket.on('disconnect', function () {
		connectedClients.delete(socket.id);

		socket.broadcast.emit("other-socket-disconnected", socket.id);
	});

	socket.on('update-client-to-server', data => {
		connectedClients.set(socket.id, data);
		console.log(connectedClients);
		socket.broadcast.emit("update-server-to-client", Array.from(connectedClients));
	});
});
