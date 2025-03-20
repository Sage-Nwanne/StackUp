const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAuthorized: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
