const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const beveragesSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  number_in_stock: {
    type: Number,
    required: true
  },
  alert_amount: {
    type: Number,
    required: true
  },
  number_sold: {
    type: Number
  }
});

module.exports = Beverages = mongoose.model('beverages', beveragesSchema);