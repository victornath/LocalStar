import express from "express";
import asyncHandler from "express-async-handler";
import User from "./models/UserModel.js";
import users from "./data/Users.js";

const ImportData = express.Router()

ImportData.post("/user", asyncHandler(async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
}));

export default ImportData;