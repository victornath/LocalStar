import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDB.js";
import ImportData from "./DataImport.js";
import http from "http";
import { errorHandler, notFound } from "./middleware/Errors.js";
import userRouter from "./routes/UserRoutes.js";
import playroomRouter from "./routes/PlayroomRoutes.js";
import itemRouter from "./routes/ItemRoutes.js";
import { Server } from "socket.io";
import cors from 'cors';

dotenv.config();
connectDatabase();
const app = express();
const server = http.createServer(app)
app.use(express.json());
app.use(cors())
app.use("/api/import", ImportData);
app.use("/api/users", userRouter);
app.use("/api/playrooms", playroomRouter);
app.use("/api/items", itemRouter);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
let users = []
let _id

io.on("connection", (socket) => {
    // Disconnect listener
    socket.on('disconnect', (reason) => {
        socket.broadcast.emit("user-disconnected", _id)
    });
    socket.on("new-user", name => {
        users[socket.id] = name
        socket.broadcast.emit("user-connected", name)
    })
    socket.on("send-chat-message", message => {
        socket.broadcast.emit("chat-message", message)
    })

    socket.on("playroom_enter", param => {
        _id = param._id
        socket.broadcast.emit("playroom_addplayer", param)
    })

    socket.on("playroom_walk", param =>{
        socket.broadcast.emit("playroom_walk", param)
    })
})


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, console.log(`server running in port ${PORT}`));
