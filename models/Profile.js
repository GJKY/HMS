const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  skills: {
    type: [String],
    required: true
  }
});

module.exports = Profile = mongoose.model('profiles', ProfileSchema);