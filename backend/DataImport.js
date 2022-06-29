import express from "express";
import asyncHandler from "express-async-handler";
import User from "./models/UserModel.js";
import users from "./data/Users.js";
import Item from "./models/ItemModel.js";
import items from "./data/Items.js";
import Playroom from "./models/PlayroomModel.js";
import playrooms_congklak from "./data/Playrooms_congklak.js";
import playrooms_gobaksodor from "./data/Playrooms_gobaksodor.js";
import playrooms_tariktambang from "./data/Playrooms_tariktambang.js";
import playrooms_balapkarung from "./data/Playrooms_balapkarung.js";
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
    const importPlayroom = []
    importPlayroom[0] = await Playroom.insertMany(playrooms_congklak);
    importPlayroom[1] = await Playroom.insertMany(playrooms_gobaksodor);
    importPlayroom[2] = await Playroom.insertMany(playrooms_tariktambang);
    importPlayroom[3] = await Playroom.insertMany(playrooms_balapkarung);
    res.send({ importPlayroom });
}));

ImportData.post("/gacha", asyncHandler(async (req, res) => {
    await Gacha.remove({});
    const importGacha = await Gacha.insertMany(gachas);
    res.send({ importGacha });
}));

export default ImportData;