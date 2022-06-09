import express from "express";
import asyncHandler from "express-async-handler";
import User from "./models/UserModel.js";
import users from "./data/Users.js";
import Item from "./models/ItemModel.js";
import items from "./data/Items.js";

const ImportData = express.Router()

ImportData.post("/user", asyncHandler(async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
}));

ImportData.post("/item", asyncHandler(async (req, res) => {
    await Item.remove({});
    const importItem = await Item.insertMany(items);
    res.send({ importItem });
}));

export default ImportData;