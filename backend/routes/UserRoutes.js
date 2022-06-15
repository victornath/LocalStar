import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../middleware/AuthMiddleware.js";
import User from "../models/UserModel.js";
import Item from "../models/ItemModel.js";
import generateToken from "../utils/generateToken.js";

const userRouter = express.Router();

// LOGIN
userRouter.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            experience: user.experience,
            point: user.point,
            gold: user.gold,
            numOfWin: user.numOfWin,
            equipped_items: user.equipped_items,
            token: generateToken(user._id),
            createdAt: user.createdAt,
        })
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password. Please try again.");
    }
    res.json(products);
}));

//REGISTER
userRouter.post("/", asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists.");
    }
    const user = await User.create({
        name, email, password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Error Bad Request: Invalid user data.")
    }
}));

// PROFILE
userRouter.get("/profile", protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,

            createdAt: user.createdAt,
        })
    } else {
        res.status(404);
        throw new Error("Error Not Found : Failed to Get User Profile Data.");
    }
}));

// GET USER ITEM

userRouter.get("/inventory", protect, asyncHandler(async (req, res) => {
    const { category } = req.body
    const user = await User.findById(req.user._id);
    let query

    switch (category) {
        case "hat":
            query = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "hat" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(query)
            break;
        case "hair":
            query = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "hair" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(query)
            break;
        case "top":
            query = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "top" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(query)
            break;
        case "bottom":
            query = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "bottom" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(query)
            break;
        case "shoes":
            query = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "shoes" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(query)
            break;
        default:
            break;
    }

}
));

// UPDATE EQUIPPED ITEM FOR USER
userRouter.patch("/inventory", protect, asyncHandler(async (req, res) => {
    const { equipped_items } = req.body
    const user = await User.findById(req.user._id);

    try {
        await User.updateOne({
            _id: user._id,
        }, {
            equipped_items: equipped_items,
        }
        )

    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error: Failed to Save Equipped Items.");
    }
}
));




export default userRouter;