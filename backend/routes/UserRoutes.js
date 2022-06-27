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

// UPDATE PROFILE DATA
userRouter.put(
    "/profile",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                createdAt: updatedUser.createdAt,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    })
);

// GET USER DATA FOR LOBBY
userRouter.get("/getData", protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            name: user.name,
            email: user.email,
            point: user.point,
            gold: user.gold,
            level: user.level,
            experience: user.experience,
            num_of_win: user.num_of_win
        })
    } else {
        res.status(404);
        throw new Error("Error Not Found : Failed to Get User Data.");
    }
}));

// GET USER EQUIPPED ITEM
userRouter.get("/", asyncHandler(async (req, res) => {
    const user = await User.findById(req.query.id);
    if (user) {
        res.json({
            equipped_items: user.equipped_items,
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
    const user = await User.findById(req.user._id);
    const gacha_temp = await Gacha.find({ name: gacha_name });
    const gacha = gacha_temp[0]
    if (gacha.currency === "point") {
        if (user.point < gacha.price) {
            res.json({
                message: "Point is not sufficient."
            })
        } else {
            let newPoint = user.point -= gacha.price
            await User.updateOne({ _id: user._id }, {
                $set: {
                    point: newPoint,
                }
            }).catch(
                error => {
                    console.log(error);
                }
            );
            let gachaResult = await Gacha.aggregate([
                { $match: { gacha_name: gacha.gacha_name } },
                { $unwind: "$item_ids" },
                { $sample: { size: 1 } },
                { $group: { _id: "$gacha_name", item_ids: { $push: "$item_ids" } } },
            ])
            result = gachaResult[0].item_ids
        }
    } else if (gacha.currency === "gold") {
        if (user.gold < gacha.price) {
            res.json({
                message: "Point is not sufficient."
            })
        } else {
            let newPoint = user.gold -= gacha.price
            await User.updateOne({ _id: user._id }, {
                $set: {
                    gold: newPoint,
                }
            }).catch(
                error => {
                    console.log(error);
                }
            );
            let gachaResult = await Gacha.aggregate([
                { $match: { gacha_name: gacha.gacha_name } },
                { $unwind: "$item_ids" },
                { $sample: { size: 1 } },
                { $group: { _id: "$gacha_name", item_ids: { $push: "$item_ids" } } },
            ])
            result = gachaResult[0].item_ids
        }
    }
    let userItem
    // CHECK IF ITEM HAS OWNED BY USER OR NOT

    userItem = await User.aggregate([
        { $match: { _id: user._id } },
        { $unwind: "$item_owned" },
        { $group: { _id: "$_id", item_owned: { $push: "$item_owned.item_id" } } }
    ])

    let foundGachaResult = false

    for (let i = 0; i < userItem[0].item_owned.length; i++) {
        let element = userItem[0].item_owned[i];
        if (element == result) {
            foundGachaResult = true
            if (gacha.currency === "point") {
                let newPoint = user.point += (gacha.price / 2)
                await User.updateOne({ _id: user._id }, {
                    $set: {
                        point: newPoint,
                    }
                }).catch(
                    error => {
                        console.log(error);
                    }
                );
                res.json({
                    result: result[0],
                    message: "You have already owned the item. Refunded 50% of Gacha Price"
                })
            } else if (gacha.currency === "gold") {
                let newPoint = user.gold += (gacha.price / 2)
                await User.updateOne({ _id: user._id }, {
                    $set: {
                        gold: newPoint,
                    }
                }).catch(
                    error => {
                        console.log(error);
                    }
                );
                res.json({
                    result: result[0],
                    message: "You have already owned the item. Refunded 50% of Gacha Price"
                })
            }
        }

    }
    if (foundGachaResult == false) {
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
            result: result[0],
            message: "Congratulations."
        })
    }



}
));

userRouter.patch("/game-result", protect, asyncHandler(async (req, res) => {
    const { game_name, win_player_id, lose_player_id, reason } = req.body

    const winUser = await User.findById(win_player_id);
    const loseUser = await User.findById(lose_player_id);

    let winnerNewPoint, winnerNewGold, winnerExperience, loserNewPoint, loserNewGold, loserExperience, newNumOfWin

    switch (game_name) {
        case "Congklak":
            if (reason == 1) {
                winnerNewPoint = winUser.point += 50
                winnerNewGold = winUser.gold += 10
                winnerExperience = winUser.experience += 15
                newNumOfWin = winUser.num_of_win
                newNumOfWin[0] += 1
                loserNewPoint = loseUser.point += 10
                loserExperience = loseUser.experience += 8
            }
            else if (reason == 0) {  // PLAYER DISCONNECTED
                loserNewPoint = loseUser.point -= 10
            }
            else if (reason == 2) {
                winnerNewPoint = winUser.point += 25
                winnerNewGold = winUser.gold += 3
                winnerExperience = winUser.experience += 10
                loserNewPoint = loseUser.point += 25
                loserNewGold = loseUser.gold += 3
                loserExperience = loseUser.experience += 10
            }
            break;
        case "Gobak Sodor":
            if (reason == 1) {
                winnerNewPoint = winUser.point += 25
                winnerNewGold = winUser.gold += 5
                winnerExperience = winUser.experience += 10
                newNumOfWin = winUser.num_of_win
                newNumOfWin[1] += 1
                loserNewPoint = loseUser.point += 5
                loserExperience = loseUser.experience += 5
            }
            else if (reason == 0) {  // PLAYER DISCONNECTED
                loserNewPoint = loseUser.point -= 10
            }
            else if (reason == 2) {
                winnerNewPoint = winUser.point += 10
                winnerNewGold = winUser.gold += 1
                winnerExperience = winUser.experience += 8
                loserNewPoint = loseUser.point += 10
                loserNewGold = loseUser.gold += 1
                loserExperience = loseUser.experience += 8
            }
            break;
        case "Tarik Tambang":
            if (reason == 1) {
                winnerNewPoint = winUser.point += 25
                winnerNewGold = winUser.gold += 5
                winnerExperience = winUser.experience += 10
                newNumOfWin = winUser.num_of_win
                newNumOfWin[2] += 1
                loserNewPoint = loseUser.point += 5
                loserExperience = loseUser.experience += 5
            }
            else if (reason == 0) {  // PLAYER DISCONNECTED
                loserNewPoint = loseUser.point -= 10
            }
            else if (reason == 2) {
                winnerNewPoint = winUser.point += 10
                winnerNewGold = winUser.gold += 1
                winnerExperience = winUser.experience += 8
                loserNewPoint = loseUser.point += 10
                loserNewGold = loseUser.gold += 1
                loserExperience = loseUser.experience += 8
            }
            break;
        case "Balap Karung":
            if (reason == 1) {
                winnerNewPoint = winUser.point += 25
                winnerNewGold = winUser.gold += 5
                winnerExperience = winUser.experience += 10
                newNumOfWin = winUser.num_of_win
                newNumOfWin[3] += 1
                loserNewPoint = loseUser.point += 5
                loserExperience = loseUser.experience += 5
            }
            else if (reason == 0) {  // PLAYER DISCONNECTED
                loserNewPoint = loseUser.point -= 10
            }
            else if (reason == 2) {
                winnerNewPoint = winUser.point += 10
                winnerNewGold = winUser.gold += 1
                winnerExperience = winUser.experience += 8
                loserNewPoint = loseUser.point += 10
                loserNewGold = loseUser.gold += 1
                loserExperience = loseUser.experience += 8
            }
            break;
    }

    var [winUserLevel, winUserExp] = levelCalculator(winUser.level, winUser.experience)
    var [loseUserLevel, loseUserExp] = levelCalculator(loseUser.level, loseUser.experience)

    console.log(winUserLevel, winUserExp)
    await User.updateOne({ _id: winUser._id }, {
        $set: {
            point: winnerNewPoint,
            gold: winnerNewGold,
            level: winUserLevel,
            experience: winUserExp,
            num_of_win: newNumOfWin
        }
    }).catch(
        error => {
            console.log(error);
        }
    );

    await User.updateOne({ _id: loseUser._id }, {
        $set: {
            point: loserNewPoint,
            gold: loserNewGold,
            level: loseUserLevel,
            experience: loseUserExp,
        }
    }).catch(
        error => {
            console.log(error);
        }
    );
    res.json({
        message: "Success."
    })

}))

function levelCalculator(level, experience) {
    switch (level) {
        case 1:
            if (experience >= 20) {
                level += 1
                experience -= 20
            }
            break;
        case 2:
            if (experience >= 40) {
                level += 1
                experience -= 40
            }
            break;
        case 3:
            if (experience >= 60) {
                level += 1
                experience -= 60
            }
            break;
        case 4:
            if (experience >= 100) {
                level += 1
                experience -= 100
            }
            break;
        case 5:
            if (experience >= 150) {
                level += 1
                experience -= 150
            }
            break;
        case 6:
            if (experience >= 210) {
                level += 1
                experience -= 210
            }
            break;
        case 7:
            if (experience >= 280) {
                level += 1
                experience -= 280
            }
            break;
        case 8:
            if (experience >= 360) {
                level += 1
                experience -= 360
            }
            break;
        case 9:
            if (experience >= 450) {
                level += 1
                experience -= 450
            }
            break;
        case 10:
            if (experience >= 100000) {
                experience -= 100000
            }
            break;
    }
    return [level, experience]
}




export default userRouter;