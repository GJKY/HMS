const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const room101Schema = new Schema ({
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
  }
});

module.exports = Room101 = mongoose.model('room101', room101Schema);