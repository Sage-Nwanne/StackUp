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
router.post("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const boardId = req.params.boardId;

        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(403).json({ error: "Unauthorized: You do not own this board" });
        }

        const newList = await List.create({
            name: req.body.name,
            boardId: boardId,
        });
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post Create Card in List
router.post("/:boardId/:listId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        console.log(userId);
        const boardId = req.params.boardId;
        const listId = req.params.listId;

        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(403).json({ error: "Unauthorized: You do not own this board" });
        }

        const list = await List.findOne({ _id: listId, boardId: boardId });
        if (!list) {
            return res.status(404).json({ error: "List not found in this board" });
        }

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
        const boardId = req.params.boardId;
        const userId = req.user._id;
        console.log(userId);
        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(404).json({ err: "Board not found or unauthorized" });
        }
        const lists = await List.find({ boardId: boardId });
        const cards = await Card.find({ listId: { $in: lists.map((list) => list._id) } });

        res.json({ board, lists, cards });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update board
router.put("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id
        const existingBoard = await Board.findOne({
            _id: req.params.boardId,
            ownerId: userId,
        });

        if (!existingBoard) {
            return res.status(404).json({ error: "Board not found or unauthorized" });
        }

        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.boardId,
            {
                ...req.body,
                ownerId: userId,
            },
            { new: true }
        );

        res.json(updatedBoard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// update list
router.put("/:boardId/:listId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const { boardId, listId } = req.params;

        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(403).json({ error: "Unauthorized: You do not own this board" });
        }

        const updatedList = await List.findOneAndUpdate(
            { _id: listId, boardId: boardId },
            { ...req.body },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).json({ error: "List not found or does not belong to this board" });
        }

        res.status(201).json(updatedList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//update cards
router.put("/:boardId/:listId/:cardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const { boardId, listId, cardId } = req.params;
        const board = await Board.findOne({ _id: boardId, ownerId: userId });
       
        if (!board) {
            return res.status(403).json({ error: "Unauthorized: You do not own this board" });
        }
        const list = await List.findOne({ _id: listId, boardId: boardId });
       
        if (!list) {
            return res.status(404).json({ error: "List not found or does not belong to this board" });
        }
        
        const updatedCard = await Card.findOneAndUpdate(
            { _id: cardId, listId: listId }, 
            { ...req.body }, 
            { new: true });

            if (!updatedCard) {
                return res.status(404).json({ error: "Card not found or does not belong to this board" });
            }
            res.json(updatedCard);

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

router.delete("/:boardId/:listId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const { boardId, listId } = req.params;

        // Check if the board exists and belongs to the current user
        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(404).json({ error: "Board not found or unauthorized" });
        }

        // Ensure the list belongs to the board before deleting
        const list = await List.findOne({ _id: listId, boardId: boardId });
        if (!list) {
            return res.status(404).json({ error: "List not found or does not belong to this board" });
        }

        // Delete the list
        const deletedList = await List.findOneAndDelete({ _id: listId });

        if (!deletedList) {
            return res.status(404).json({ error: "Failed to delete the list" });
        }

        // Respond with a 204 No Content status for successful deletion
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:boardId/:listId/:cardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const { boardId, listId, cardId } = req.params;

        const deletedCard = await Card.findOneAndDelete({_id: cardId});
        if (!deletedCard) {
            return res.status(404).json({ error: "Failed to delete the card" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
});



module.exports = router;
