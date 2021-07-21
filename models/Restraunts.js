const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const restrauntsSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  food_menu: {
    type: [Schema.Types.ObjectId],
    ref: 'food',
    required: true
  },
  drinks_menu: {
    type: [Schema.Types.ObjectId],
    ref: 'beverages',
    required: true
  },
  epos: {
    type: [Schema.Types.ObjectId],
    ref: 'epos',
    required: true
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

module.exports = Restraunts = mongoose.model('restraunts', restrauntsSchema);