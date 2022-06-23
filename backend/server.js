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
var chat_users = []
var clients = []
let _id = []
let room = []

io.on("connection", (socket) => {
    clients.push(socket)
    _id[socket.id]
    room[socket.id] = []
    // Disconnect listener
    socket.on('disconnect', (reason) => {
        if (room[socket.id]["playroom"] !== undefined) {
            io.emit("room_leave", { _id: _id[socket.id], room: room[socket.id]["playroom"] })
        } else if (room[socket.id]["gameroom"] !== undefined) {
            io.emit("room_leave", { _id: _id[socket.id], room: room[socket.id]["gameroom"] })
        }
        clients.splice(clients.indexOf(socket), 1)
    });
    socket.on("new-user", name => {
        chat_users[socket.id] = name
        socket.broadcast.emit("user-connected", name)
    })

    socket.on("send-chat-message", message => {
        socket.broadcast.emit("chat-message", message)
    })

    // Reusable Sockets
    socket.on("ask_id", param => {
        socket.to(param).emit("ask_id", socket.id)
    })
    socket.on("give_id", param => {
        socket.to(param.to).emit(param.roomType + "_already_in", param)
    })

    // Lobby Sockets
    socket.on("lobby_checkRooms", (param, callback) => {
        let rooms = []
        let game_name
        switch (param) {
            case 1:
                game_name = "congklak"
                break;
            case 2:
                game_name = "gobaksodor"
                break;
            case 3:
                game_name = "tambang"
                break;
            case 4:
                game_name = "karung"
                break;
        }
        for (let i = 1; i <= 5; i++) {
            let count
            if (io.sockets.adapter.rooms.get("room_" + game_name + "_" + i)) {
                count = io.sockets.adapter.rooms.get("room_" + game_name + "_" + i).size
            } else {
                count = 0
            }
            rooms.push({
                game: param,
                roomName: "room_" + game_name + "_" + i,
                user_count: count
            })
        }
        callback({
            roomList: rooms
        })
    })

    // PLAYROOM SOCKETS
    socket.on("playroom_enter", (param, callback) => {
        _id[socket.id] = param._id
        room[socket.id]["playroom"] = param.roomId
        socket.join(param.roomId)
        socket.to(room[socket.id]["playroom"]).emit("playroom_addplayer", param)
        if (io.sockets.adapter.rooms.get(room[socket.id]["playroom"])) {
            let players = io.sockets.adapter.rooms.get(room[socket.id]["playroom"])
            let players_array = Array.from(players)
            callback({
                userList: players_array
            })
        }
    })

    socket.on("playroom_walk", param => {
        socket.to(room[socket.id]["playroom"]).emit("playroom_walk", param)
    })

    // Gameroom Sockets
    socket.on("gameroom_enter", (param, callback) => {
        _id[socket.id] = param._id
        room[socket.id]["gameroom"] = param.roomId
        socket.join(param.roomId)
        if (io.sockets.adapter.rooms.get(room[socket.id]["gameroom"])) {
            let players = io.sockets.adapter.rooms.get(room[socket.id]["gameroom"])
            let players_array = Array.from(players)
            callback({
                userList: players_array
            })
        }
    })

    socket.on("gameroom_playerLoaded", param => {
        param.socket_id = socket.id
        socket.to(room[socket.id]["gameroom"]).emit("gameroom_newPlayer", param)
    })

    socket.on("gameroom_playerFilled", param => {
        param.p1 = socket.id,
            socket.to(param.p2).emit("gameroom_ready_ask", param)
        socket.emit("gameroom_ready_ask", param)
    })

    socket.on("gameroom_playerReady", param => {
        if (socket.id === param.p1) {
            socket.to(param.p2).emit("gameroom_ready_check", param)
        } else {
            socket.to(param.p1).emit("gameroom_ready_check", param)
        }
    })

    socket.on("gameroom_ready_check", param => {
        if (param.ready) {
            if (socket.id === param.p1) {
                if (param.timed == true) {
                    param.startAt = performance.now()
                }
                socket.to(param.p2).emit("gameroom_start", param)
                socket.emit("gameroom_start", param)
            } else {
                if (param.timed == true) {
                    param.startAt = performance.now()
                }
                socket.to(param.p1).emit("gameroom_start", param)
                socket.emit("gameroom_start", param)
            }
        }
    })

    socket.on("gameroom_move", param => {
        if (socket.id === param.p1) {
            socket.to(param.p2).emit("gameroom_move", param)
        } else {
            socket.to(param.p1).emit("gameroom_move", param)
        }
    })
    socket.on("gameroom_timeout", param => {
        if (socket.id === param.p1) {
            socket.to(param.p2).emit("gameroom_timeout", param)
        } else {
            socket.to(param.p1).emit("gameroom_timeout", param)
        }
    })

    socket.on("gameroom_timecheck", (callback) => {
        callback(performance.now())
    })
})


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, console.log(`server running in port ${PORT}`));
