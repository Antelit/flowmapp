const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const routerPage = require('./router/home');

let nextVisitorNumber = 1;
let Clients = new Set();
let Visuals = new Set();
let AllMachine = new Set();
const SERVER_PORT = 3001;

app.use('/', routerPage);
app.use(express.static("public"));

io.on("connection", onNewWebsocketConnection);

server.listen(SERVER_PORT, () => {
    console.info(`Listening on port ${SERVER_PORT}.`);
});

/*let secondsSinceServerStarted = 0;
setInterval(() => {
    secondsSinceServerStarted++;
    io.emit("seconds", secondsSinceServerStarted);
    io.emit("online", onlineClients.size);
}, 1000);*/

function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);

    socket.on("disconnect", () => {
        AllMachine.delete(socket);
        Visuals.delete(socket);
        Clients.delete(socket);
        console.info(`Socket ${socket.id} has disconnected.`);
        Visuals.forEach(Visual => {
            Visual.send({
                Type: "DeleteCursore",
                Client: socket.id
            })
        })
    });

    socket.on("mousePosition", position => {
        Visuals.forEach(Visual => {
            Visual.send({
                Type: "RenderCursor",
                Clients: position
            })
        })
        console.info(`Socket ${socket.id} says: "${JSON.stringify(position)}"`);
    });

    socket.on("hello", helloMsg => {
        console.info(`Socket ${socket.id} says: "${JSON.stringify(helloMsg)}"`);
        if (helloMsg.Type == 'Client') {
            Clients.add(socket);
        } else if (helloMsg.Type == 'Visual') {
            Visuals.add(socket);
        } else {
            socket.emit("WhoAreYou", "Send me you type Client or Visual!");
        }
        AllMachine.add(socket);
    });



    socket.emit("ID", socket.id);
}