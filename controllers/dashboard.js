const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Board = require("../models/board.js");
const List = require("../models/list.js");
const Card = require("../models/card.js");
const router = express.Router();

// GET '/dashboard'
//getting the dashboard
router.get("/", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        //if correct user, find the boards of user...
        const boards = await Board.find({ ownerId: userId });
        //if boards don't exist...
        if (!boards) {
            return res.status(404).json({ err: "No boards found" });
        } //if they do...
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST '/dashboard'
//posting a board to dashboard
router.post("/", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const board = await Board.create({
            name: req.body.name,
            ownerId: userId,
        });
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Post Create List in Board
router.post("/:boardId", verifyToken, async function (req, res) {
    try {
        const boardId = req.params.boardId;
        const newList = await List.create({
            name: req.body.name,
            boardId: boardId,
        });
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Post create card in list
router.post("/:boardId/:listId", verifyToken, async function (req, res) {
    try {
        const listId = req.params.listId;
        const newCard = await Card.create({
            name: req.body.name,
            listId: listId,
        });
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single board
router.get("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const board = await Board.findOne({
            _id: req.params.boardId,
            ownerId: userId,
        });

        if (!board) {
            return res.status(404).json({ error: "Board not found or unauthorized" });
        }

        res.json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update board
router.put("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;

        // First check if the board exists and belongs to the user
        const existingBoard = await Board.findOne({
            _id: req.params.boardId,
            ownerId: userId,
        });

        if (!existingBoard) {
            return res.status(404).json({ error: "Board not found or unauthorized" });
        }

        // Update the board, maintaining the original ownerId
        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.boardId,
            {
                ...req.body,
                ownerId: userId, // Ensure ownerId cannot be changed
            },
            { new: true }
        );

        res.json(updatedBoard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE board
router.delete("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;

        // Find and delete the board only if it belongs to the user
        const deletedBoard = await Board.findOneAndDelete({
            _id: req.params.boardId,
            ownerId: userId,
        });

        if (!deletedBoard) {
            return res.status(404).json({ error: "Board not found or unauthorized" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
