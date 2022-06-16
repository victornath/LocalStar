import express from "express";
import asyncHandler from "express-async-handler";
import Item from "../models/ItemModel.js";

const itemRouter = express.Router();

// GET ITEM NAME BY ID
itemRouter.get("/", asyncHandler(async (req, res) => {
    const item = await Item.find({ id: req.query.id });
    if (item) {
        res.json(item[0].name)
    } else {
        res.status(404);
        throw new Error("Error Not Found : Failed to Get Item Data.");
    }
}));

export default itemRouter