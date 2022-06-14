import mongoose from "mongoose";

const tableSchema = mongoose.Schema({
    table_id: {
        type: Number,
        unique: true,
        required: true,
    },
    user_ids: {
        type: [Number],
        default: null,
    },
    _id: false,
})

const Table = mongoose.model("Table", tableSchema);

export default Table;