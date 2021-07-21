const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Rooms Model
const Rooms = require('../../models/Rooms');

//  @route  POST api/rooms/create
//  @desc   Create a room.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const rooms = {
    name: body.roomName,
    max_occupancy: body.maxOccupancy,
    price: body.price,
    dates_booked: [],
    description: body.description,
    room_temperature: '18',
    bathroom_lighting: '#FFF',
    bedroom_lighting: '#FFF',
    room_music: '',
    music_image: '',
    music_name: '',
    number_of_bookings: 0
  }

  Rooms.create(rooms, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/rooms/all
//  @desc   Return all rooms.
//  @access Public
router.get('/all', (req, res) => {

  Rooms.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/rooms/available
//  @desc   Return all available rooms.
//  @access Public
router.post('/available', (req, res) => {

  const { body } = req

  const dateBooked = body.dateBooked
  const totalGuests = body.totalGuests

  Rooms.find({ $and: [ { dates_booked: { $nin: dateBooked } }, { max_occupancy: { $gte: totalGuests } } ]}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/rooms/search
//  @desc   Returns room ID from name search.
//  @access Public
router.post('/search', (req, res) => {

  const { body } = req

  const roomName = body.roomName

  Rooms.findOne({ name: { $eq: roomName } }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/rooms/remove
//  @desc   Remove room by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const roomID = mongoose.Types.ObjectId(body.roomID);

  Rooms.findByIdAndDelete({ _id: roomID }).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result })
  });

});

//  @route   POST api/rooms/amend
//  @desc    Amend a room by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const roomID = mongoose.Types.ObjectId(body.roomID);

  Rooms.findByIdAndUpdate({ _id: roomID }, {
    $set: {
      name: body.roomName,
      max_occupancy: body.maxOccupancy,
      price: body.price,
      description: body.description
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

module.exports = router;