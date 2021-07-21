const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const bookingsSchema = new Schema ({
  date_booked: {
    type: [String],
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'rooms',
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
    required: true
  }
});

module.exports = Bookings = mongoose.model('bookings', bookingsSchema);