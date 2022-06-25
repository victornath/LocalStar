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
        default: 150,
    },
    gold: {
        type: Number,
        default: 5,
    },
    item_owned: {
        type: [Object],
        default: [
            {
                item_id: "top_shirt_wh",
                category: "top",
            },
            {
                item_id: "bottom_pants_s_lbl",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_s_bk",
                category: "bottom",
            },
            {
                item_id: "shoes_basic_rd",
                category: "shoes",
            },
        ],
    },
    num_of_win: {
        type: Object,
        default: {
            congklak: 0,
            gobak_sodor: 0,
            tarik_tambang: 0,
            balap_karung: 0,
        },
    },
    equipped_items: {
        type: Object,
        default: {
            hat: "",
            hair: "",
            top: "top_shirt_wh",
            bottom: "bottom_pants_lbl",
            shoes: "shoes_basic_rd",
        },
    },
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