const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List', 
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


module.exports = mongoose.model('Board', boardSchema);
