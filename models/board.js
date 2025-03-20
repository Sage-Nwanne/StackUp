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
        },
        lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
