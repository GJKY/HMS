const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const departmentsSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  department_staff: {
    type: [Schema.Types.ObjectId],
    ref: 'staff'
  },
  department_epos: {
    type: [Schema.Types.ObjectId],
    ref: 'epos'
  },
  department_bars: {
    type: [Schema.Types.ObjectId],
    ref: 'bars'
  },
  department_tables: {
    type: [Schema.Types.ObjectId],
    ref: 'tables'
  }
});

module.exports = Departments = mongoose.model('departments', departmentsSchema);