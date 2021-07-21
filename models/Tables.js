const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const tablesSchema = new Schema ({
  table_number: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments'
  },
  is_empty: {
    type: Boolean,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
});

module.exports = Tables = mongoose.model('tables', tablesSchema);