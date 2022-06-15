import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../middleware/AuthMiddleware.js";
import Playroom from "../models/PlayroomModel.js";

const playroomRouter = express.Router();

playroomRouter.get("/lobby", protect, asyncHandler(async (req, res) => {
    const playroom = await Playroom.find()
    res.json(playroom)
}));

export default playroomRouter