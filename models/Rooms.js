const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const roomsSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  max_occupancy: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dates_booked: {
    type: [String]
  },
  room_temperature: {
    type: String
  },
  bathroom_lighting: {
    type: String
  },
  bedroom_lighting: {
    type: String
  },
  room_music: {
    type: String
  },
  music_image: {
    type: String
  },
  music_name: {
    type: String
  },
  number_of_bookings: {
    type: Number
  }
});

module.exports = Rooms = mongoose.model('rooms', roomsSchema);