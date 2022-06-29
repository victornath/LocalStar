import mongoose from "mongoose";

const playroomSchema = mongoose.Schema({
    playroom_id: {
        type: Number,
        unique: true,
        required: true,
    },
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    room_name: {
        type: String,
        required: true,
    },
    floor: {
        type: String,
        required: true,
    },
    wall: {
        type: String,
        required: true,
    },
    spawn: {
        type: Object,
        required: true,
    },
    objects: {
        type: [Object],
        required: true,
    },
    _id: false,
})

const Playroom = mongoose.model("Playroom", playroomSchema);

export default Playroom;