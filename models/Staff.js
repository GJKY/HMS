const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const staffSchema = new Schema ({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'departments'
  },
  staff_details: {
    type: [Schema.Types.ObjectId],
    ref: 'staffdetails'
  },
  epos_login: {
    type: String
  },
  management_code: {
    type: String
  }
});

module.exports = Staff = mongoose.model('staff', staffSchema);