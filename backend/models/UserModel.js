import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 6,
        maxLength: 12,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    point: {
        type: Number,
        default: 100,
    },
    gold: {
        type: Number,
        default: 5,
    },
    item_ids: {
        type: [String],
        default: null,
    },
    num_of_win: {
        type: [Number],
        default: [0, 0, 0, 0],
    }
},
    {
        timestamps: true,
    }
)

// LOGIN

userSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

// REGISTER

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

export default User;