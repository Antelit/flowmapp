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

io.on("connection", ClientConnect);

server.listen(SERVER_PORT, () => {
    console.info(`Server run on port: ${SERVER_PORT}.`);
});

let secondsSinceServerStarted = 0;
setInterval(() => {
    secondsSinceServerStarted++;
    io.emit('Stats', {Type: "Stats", data: {
        secondOnStart:secondsSinceServerStarted, 
        countVisuals: Visuals.size,
        countClients: Clients.size}});
}, 1000);

function ClientConnect(socket) {
    socket.on("disconnect", () => {
        AllMachine.delete(socket);
        Visuals.delete(socket);
        Clients.delete(socket);
        Visuals.forEach(Visual => {
            Visual.send({
                Type: "DeleteCursore",
                Client: socket.id
            });
        });
    });

    socket.on("mousePosition", position => {
        Visuals.forEach(Visual => {
            Visual.send({
                Type: "RenderCursor",
                Clients: position
            });
        });
    });

    socket.on("hello", helloMsg => {
        if (helloMsg.Type == 'Client') {
            Clients.add(socket);
        } else if (helloMsg.Type == 'Visual') {
            Visuals.add(socket);
        } else {
            socket.emit("error", {errorMessage: "I'm don't who you! Send me Client or Visual on you type"});
        }
        AllMachine.add(socket);
    });
    socket.emit("ID", {message: "Hello!", id: socket.id});
}