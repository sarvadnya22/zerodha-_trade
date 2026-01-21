const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    displayName: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

// Hash password before saving
UserSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", UserSchema);
