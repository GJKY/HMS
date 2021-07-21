const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Bookings, Customers & Rooms Model
const Bookings = require('../../models/Bookings');
const Rooms = require('../../models/Rooms');
const Customers = require('../../models/Customers');

//  @route  POST api/bookings/create
//  @desc   Create a booking.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const roomID = mongoose.Types.ObjectId(body.roomID);
  const customerID = mongoose.Types.ObjectId(body.customerID);

  const bookings = {
    _id: mongoose.Types.ObjectId(),
    date_booked: [body.dateBooked],
    room: roomID,
    customer: customerID
  }

  console.log(bookings)
  
  Bookings.create(bookings, (error, response) => {
    if (error) {

    }
  });

  Customers.findOneAndUpdate({ _id: customerID }, {
    $push: {
      reservations: bookings._id
    }}).then((error, result) => {
      if (error){
        
      }
  });

  Rooms.findByIdAndUpdate({ _id: roomID }, {
    $push: {
      dates_booked: body.dateBooked
    }, $inc: {number_of_bookings: + 1}}).then((error, result) => {
      if (error){

      }
    });

  res.status(200).send({ success: true })

});

//  @route  GET api/bookings/all
//  @desc   Return all bookings.
//  @access Public
router.get('/all', (req, res) => {

  Bookings.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/bookings/remove
//  @desc   Remove a booking by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const bookingID = mongoose.Types.ObjectId(body.bookingID);
  const roomID = mongoose.Types.ObjectId(body.roomID);
  const customerID = mongoose.Types.ObjectId(body.customerID);

  Customers.findOneAndUpdate({ _id: customerID }, {
    $pull: {
      reservations: bookingID
    }}).then((error, result) => {
      if (error){
        
      }
  });

  Bookings.findByIdAndDelete({ _id: bookingID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/bookings/amend
//  @desc    Amend a booking by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const bookingID = mongoose.Types.ObjectId(body.bookingID);
  const oldRoomID = mongoose.Types.ObjectId(body.oldRoomID);
  const newRoomID = mongoose.Types.ObjectId(body.newRoomID);
  const oldCustomerID = mongoose.Types.ObjectId(body.oldCustomerID);
  const newCustomerID = mongoose.Types.ObjectId(body.newCustomerID);

  Customers.findOneAndUpdate({ _id: oldCustomerID }, {
    $pull: {
      reservations: bookingID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  Customers.findOneAndUpdate({ _id: newCustomerID }, {
    $push: {
      reservations: bookingID
    }}).then((error, result) => {
      if (error){
        
      }
  });

  Bookings.findByIdAndUpdate({ _id: bookingID }, {
    $set: {
      date_booked: body.dateBooked,
      room: newRoomID,
      customer: newCustomerID
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;