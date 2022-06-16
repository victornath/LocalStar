import express from "express";
import asyncHandler from "express-async-handler";
import protect from "../middleware/AuthMiddleware.js";
import User from "../models/UserModel.js";
import Gacha from "../models/GachaModel.js";
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
            item_owned: user.item_owned,
            num_of_win: user.num_of_win,
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

// GET USER PROFILE DATA
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

// GET USER DATA FOR LOBBY
userRouter.get("/", protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            name: user.name,
            point: user.point,
            gold: user.gold,
            equipped_items: user.equipped_items,
            level: user.level,
            experience: user.experience,
        })
    } else {
        res.status(404);
        throw new Error("Error Not Found : Failed to Get User Data.");
    }
}));

// GET FILTERED USER ITEM

userRouter.get("/inventory", protect, asyncHandler(async (req, res) => {
    let category = req.query.category

    const user = await User.findById(req.user._id);
    let filteredItem

    switch (category) {
        case "hat":
            filteredItem = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "hat" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(filteredItem)
            break;
        case "hair":
            filteredItem = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "hair" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(filteredItem)
            break;
        case "top":
            filteredItem = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "top" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(filteredItem)
            break;
        case "bottom":
            filteredItem = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "bottom" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(filteredItem)
            break;
        case "shoes":
            filteredItem = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $match: { "item_owned.category": "shoes" } },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(filteredItem)
            break;
        default:
            filteredItem = await User.aggregate([
                { $match: { _id: user._id } },
                { $unwind: "$item_owned" },
                { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
            ])
            res.json(filteredItem)
            break;
    }

}
));

// SAVE EQUIPPED ITEM FOR USER
userRouter.patch("/inventory", protect, asyncHandler(async (req, res) => {
    const equipped_items = req.body
    const user = await User.findById(req.user._id);
    console.log(equipped_items)
    await User.updateOne({ _id: user._id }, {
        $set: {
            "equipped_items.hat": equipped_items.hat,
            "equipped_items.hair": equipped_items.hair,
            "equipped_items.top": equipped_items.top,
            "equipped_items.bottom": equipped_items.bottom,
            "equipped_items.shoes": equipped_items.shoes,
        }
    }).catch(
        error => {
            console.log(error);
        }
    );
    res.json({
        message: 'Successfully save items'
    });
}
));

// GACHA SYSTEM
userRouter.patch("/shop", protect, asyncHandler(async (req, res) => {
    const { gacha_name } = req.body
    let result
    switch (gacha_name) {
        case "Basic Gacha":
            const gacha = await Gacha.find({ gacha_name: "Basic Gacha" });
            let gachaResult = await Gacha.aggregate([
                { $match: { gacha_name: gacha.gacha_name } },
                { $unwind: "$item_ids" },
                { $sample: { size: 1 } },
                { $group: { _id: "$gacha_name", item_ids: { $push: "$item_ids" } } },
            ])
            result = gachaResult[0].item_ids
            console.log("GACHA RESULT :  " + result)

            break;

        default:
            break;
    }
    let userItem
    // CHECK IF ITEM HAS OWNED BY USER OR NOT
    const user = await User.findById(req.user._id);
    userItem = await User.aggregate([
        { $match: { _id: user._id } },
        { $unwind: "$item_owned" },
        { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
    ])

    console.log("UNMODIFIED USER DATA" + userItem)

    let foundGachaResult = false

    for (let i = 0; i < userItem[0].item_owned.length; i++) {
        let element = userItem[0].item_owned[i];
        if (element == result) {
            foundGachaResult = true
            console.log("BEFORE FOUNDED: " + user)
            let newPoint = user.point += 75
            await User.updateOne({ _id: user._id }, {
                $set: {
                    point: newPoint,
                }
            }).catch(
                error => {
                    console.log(error);
                }
            );
            console.log("AFTER FOUNDED: " + user)
            res.json({
                message: "You have already owned the item."
            })
        }

    }
    if (foundGachaResult == false) {
        console.log("NOT FOUNDED: " + user)
        let resultToString = result.toString()
        await User.updateOne({
            _id: user._id,
        }, {
            $push: {
                item_owned: {
                    item_id: resultToString,
                    category: resultToString.substring(0, resultToString.indexOf('_'))
                }
            },
        }
        )
        res.json({
            message: "Congratulations."
        })
    }



}
));





export default userRouter;