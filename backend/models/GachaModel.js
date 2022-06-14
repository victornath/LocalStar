import mongoose from "mongoose";

const gachaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    currency: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    item_ids: {
        type: [String],
        required: true,
    },
    _id: false,
})

const Gacha = mongoose.model("Gacha", gachaSchema);

export default Gacha;