const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const leisureSchema = new Schema ({
  gym_users: {
    type: Number
  },
  pool_users: {
    type: Number
  },
  golf_users: {
    type: Number
  }
});

module.exports = Leisure = mongoose.model('leisure', leisureSchema);