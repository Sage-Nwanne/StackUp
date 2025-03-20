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
         movementHistory: [
            {
              fromListId: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
              toListId: { type: mongoose.Schema.Types.ObjectId, ref: "List" },
              timestamp: { type: Date, default: Date.now },
            },
        ]
    },

    { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
