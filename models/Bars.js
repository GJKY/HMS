const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const barsSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  food_menu: {
    type: [Schema.Types.ObjectId],
    ref: 'food'
  },
  drinks_menu: {
    type: [Schema.Types.ObjectId],
    ref: 'beverages'
  },
  epos: {
    type: [Schema.Types.ObjectId],
    ref: 'epos'
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments',
    required: true
  },
  staff: {
    type: [Schema.Types.ObjectId],
    ref: 'staff'
  }
});

module.exports = Bars = mongoose.model('bars', barsSchema);