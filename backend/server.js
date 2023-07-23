const http = require("http");
const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const WS = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = new Koa();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({
    server,
});

const clients = {};
const chat = [];

wsServer.on("connection", (ws) => {
    const id = uuidv4();
    clients[id] = ws;
    console.log(`New client with ${id} connected`);
    console.log(clients);
    const chatHistory = JSON.stringify({ chat });
    ws.send(chatHistory);

    ws.on("message", (rawMessage) => {
        console.log(`message from frontend: ${rawMessage}`);
        const { message } = JSON.parse(rawMessage);
        chat.push({ message });
        // console.log(eventData)
        Array.from(wsServer.clients)
            .filter((client) => client.readyState === WS.OPEN)
            .forEach((client) => client.send(JSON.stringify([{ message }])));
    });

    // Send the chat history to the newly connected client
});

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Server is listening to port: " + port);
});
