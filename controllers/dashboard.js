const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Board = require("../models/board.js")
const router = express.Router();

router.get("/", verifyToken, async function (req, res) {
    try {
       res.send("DASHBOARD");
       const userId = req.user._id;
        console.log(userId)
    
    //    const boards = await Board.find({}).populate("name")
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post("/", verifyToken, async function(req,res){
    try{
        const userId = req.user._id;
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
module.exports = router;