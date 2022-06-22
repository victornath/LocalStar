import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../middleware/AuthMiddleware.js";
import Playroom from "../models/PlayroomModel.js";

const playroomRouter = express.Router();

playroomRouter.get("/getPlayroom", asyncHandler(async (req, res) => {
    let room_name = req.query.room_name
    const playroom = await Playroom.find({
        room_name: room_name
    })
    res.json(playroom)
}));

export default playroomRouter