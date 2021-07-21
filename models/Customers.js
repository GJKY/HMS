const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const customersSchema = new Schema ({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telephone_number: {
    type: Number
  },
  credit_card_number: {
    type: String,
    required: true
  },
  first_day: {
    type: String,
    required: true
  },
  last_day: {
    type: String,
    required: true
  },
  reservations: {
    type: [Schema.Types.ObjectId],
    ref: 'bookings'
  },
  guest_pin: {
    type: String,
    required: true
  },
  room_charge_cost: {
    type: Number
  },
  room_name: {
    type: String,
    required: true
  },
  checked_in: {
    type: Boolean
  },
  checked_out: {
    type: Boolean
  }
});

module.exports = Customers = mongoose.model('customers', customersSchema);