import mongoose from "mongoose";

const playroomSchema = mongoose.Schema({
    table_id: {
        type: Number,
        required: true,
        unique: true,
    },
    game_name: {
        type: String,
        required: true,
    },
    playroom_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: [mongoose.Types.ObjectId],
        default: null,
    },
    _id: false,
})

const Playroom = mongoose.model("Playroom", playroomSchema);

export default Playroom;