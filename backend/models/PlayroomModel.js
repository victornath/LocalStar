import mongoose from "mongoose";

const playroomSchema = mongoose.Schema({
    playroom_id: {
        type: Number,
        unique: true,
        required: true,
    },
    game_name: {
        type: String,
        required: true,
    },
    furniture_ids: {
        type: [String],
        default: null,
    },
    user_ids: {
        type: [mongoose.Types.ObjectId],
        default: null,
    },
    table_ids: {
        type: [Number],
        unique: true,
        required: true,
    },
    _id: false,
})

const Playroom = mongoose.model("Playroom", playroomSchema);

export default Playroom;