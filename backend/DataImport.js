import express from "express";
import asyncHandler from "express-async-handler";
import User from "./models/UserModel.js";
import users from "./data/Users.js";
import Item from "./models/ItemModel.js";
import items from "./data/Items.js";
import Playroom from "./models/PlayroomModel.js";
import playrooms from "./data/Playrooms.js";
import Gacha from "./models/GachaModel.js";
import gachas from "./data/Gachas.js";

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

ImportData.post("/playroom", asyncHandler(async (req, res) => {
    await Playroom.remove({});
    const importPlayroom = await Playroom.insertMany(playrooms);
    res.send({ importPlayroom });
}));

ImportData.post("/gacha", asyncHandler(async (req, res) => {
    await Gacha.remove({});
    const importGacha = await Gacha.insertMany(gachas);
    res.send({ importGacha });
}));

export default ImportData;