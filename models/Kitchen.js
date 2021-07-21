const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const kitchenSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  chefs: {
    type: [Schema.Types.ObjectId],
    ref: 'staff'
  },
  department: {
    type: Schema.Types.ObjectId,
    required: true
  },
  epos: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = Kitchen = mongoose.model('kitchen', kitchenSchema);