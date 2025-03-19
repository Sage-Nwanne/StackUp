const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        listId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
