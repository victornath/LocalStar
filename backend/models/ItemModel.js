import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    rarity: {
        type: String,
        required: true,
    },
    _id: false,
})

const Item = mongoose.model("Item", itemSchema);

export default Item;