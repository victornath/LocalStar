import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../middleware/AuthMiddleware.js";
import Playroom from "../models/PlayroomModel.js";

const playroomRouter = express.Router();

playroomRouter.get("/lobby", asyncHandler(async (req, res) => {
    const playroom = Playroom.find()
    res.json({
        table_id: playroom.table_id,
        game_name: playroom.game_name,
        playroom_id: playroom.playroom_id,
        user_id: playroom.user_id,
    })
}));