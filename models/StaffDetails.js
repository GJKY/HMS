const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const staffDetailsSchema = new Schema ({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  staff_member: {
    type: Schema.Types.ObjectId,
    ref: 'staff',
    required: true
  }
});

module.exports = StaffDetails = mongoose.model('staffDetails', staffDetailsSchema);