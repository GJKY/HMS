const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const eposSchema = new Schema ({
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments'
  },
  name: {
    type: String,
    required: true
  },
  orders: {
    type: [Schema.Types.ObjectId],
    ref: 'orders'
  }
});

module.exports = Epos = mongoose.model('epos', eposSchema);