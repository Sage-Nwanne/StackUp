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
        const boards = await Board.find({ ownerId: userId})
        //if boards don't exist...
        if (!boards) {
            return res.status(404).json({ err: "No boards found" });
        }//if they do...
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST '/dashboard'
router.post("/", verifyToken, async function(req,res){
    try {
        const userId = req.user._id;
        const board = await Board.create({
            ...req.body,
            ownerId: userId, 
        });
        
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const boardId = req.params.boardId;

        // Find board and check ownership
        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(403).json({ error: "Unauthorized: You do not own this board" });
        }

        // Create the new list
        const newList = await List.create({
            name: req.body.name,
            boardId: boardId,
        });

        // Push the list's ID into the board's lists array
        board.lists.push(newList._id);
        await board.save(); // Save the updated board

        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Post Create Card in List
router.post("/:boardId/:listId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;
        const boardId = req.params.boardId;
        const listId = req.params.listId;

     

        // Fetch the board to ensure it's owned by the user
        const board = await Board.findOne({ _id: boardId, ownerId: userId });
        if (!board) {
            return res.status(403).json({ error: "Unauthorized: You do not own this board" });
        }

        // Fetch the list to ensure it's part of the board
        const list = await List.findOne({ _id: listId, boardId: boardId });
        if (!list) {
            return res.status(404).json({ error: "List not found in this board" });
        }

        // Create the new card
        const newCard = await Card.create({
            name: req.body.name,
            listId: listId,
        });

        // Add the new card to the list's cards array
        list.cards.push(newCard._id);
        await list.save(); // Save the updated list

        res.status(201).json(newCard); // Return the newly created card
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ error: error.message });
    }
});


// GET single board
router.get('/:boardId', verifyToken, async (req, res) => {
    try {
      const { boardId } = req.params;
      const board = await Board.findById(boardId)
        .populate({
          path: 'lists',
          populate: {
            path: 'cards',
          },
        })
        .exec();
  
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
  
      res.json(board); // Return the board with its lists and cards
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
    

        res.status(200).json(updatedBoard);
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

router.put("/cards/:boardId/move/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;
        const { newListId } = req.body;

    

        // Find the card
        const card = await Card.findById(cardId);
        if (!card) {

            return res.status(404).json({ error: "Card not found" });
        }

        // Find the old list
        const oldList = await List.findById(card.listId);
        if (!oldList) {
            return res.status(404).json({ error: "Old list not found" });
        }

        // Remove card from the old list
        oldList.cards = oldList.cards.filter(crdId => crdId.toString() !== cardId);
        await oldList.save();

        // Find the new list
        const newList = await List.findById(newListId);
        if (!newList) {
          
            return res.status(404).json({ error: "New list not found" });
        }

        // Add card to the new list
        newList.cards.push(cardId);
        await newList.save();

        // Update card's listId
        card.listId = newListId;
        await card.save();
        res.json({ message: "Card moved successfully", card });
    } catch (error) {
        console.error("Error moving card:", error); // Log the error in case of failure
        res.status(500).json({ error: error.message });
    }
});



// DELETE board
router.delete("/:boardId", verifyToken, async function (req, res) {
    try {
        const userId = req.user._id;

        const deletedBoard = await Board.findOneAndDelete({
            _id: req.params.boardId,
            ownerId: userId,
        });
        if (!deletedBoard) {
            return res.status(404).json({ error: "Board not found or unauthorized" });
        }
        res.status(200).json({ message: "Board deleted successfully" });
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

       
        res.status(200).json(deletedList);

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
        res.status(200).json(deletedCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
});



module.exports = router;
