const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SendEmail = require('../../SendEmail');
const nanoid = require('nanoid/generate');

// Load Customers Model
const Customers = require('../../models/Customers');

//  @route  POST api/customers/bydate
//  @desc   Return all customer bookings available for check in.
//  @access Public
router.post('/bydate', (req, res) => {

  const { body } = req

  Customers.find({ $and: [{ first_day: body.today }, { checked_in: false }]}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/customers/getcheckouts
//  @desc   Return all customer bookings due to check out.
//  @access Public
router.post('/getcheckouts', (req, res) => {

  const { body } = req

  Customers.find({ $and: [{ last_day: body.today }, { checked_out: false }]}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/customers/checkout
//  @desc   Guest check out.
//  @access Public
router.post('/checkout', (req, res) => {
  const { body } = req

  const customerID = mongoose.Types.ObjectId(body.guestID);

  Customers.findByIdAndUpdate({ _id: customerID }, {
    $set: {
      checked_in: false, checked_out: true
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

//  @route  POST api/customers/create
//  @desc   Create a customer.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const accessCode = nanoid('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

  const customers = {
    first_name: body.firstName,
    last_name: body.lastName,
    gender: body.gender,
    email: body.email,
    telephone_number: body.telNumber,
    credit_card_number: body.creditCardNum,
    reservations: [],
    guest_pin: accessCode,
    room_charge_cost: 0,
    room_name: body.bookedRoom,
    first_day: body.dayOne,
    last_day: body.endDay,
    checked_in: false,
    checked_out: false
  }

  const message = `Hello ${body.firstName} ${body.lastName},<br><br>
  We are delighted to confirm your stay from ${body.startDate} for ${body.totalNights} night(s)!<br><br>
  Check in is available from 12pm.<br><br>
  To take advantage of the Hotel's smart features, you can use the QR code on your room key to access the hotel app.<br>
  Your unique access code to login to the app is: <b>${accessCode}</b><br><br>
  Thank you,<br><br>
  The Hotel of the Future`;

  const subject = 'Hotel Booking Confirmed';

  SendEmail.sendEmail(body.email, message, subject)

  Customers.create(customers, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/customers/all
//  @desc   Return all customers.
//  @access Public
router.get('/all', (req, res) => {

  Customers.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/customers/pin
//  @desc   Return all customer details by pin and name.
//  @access Public
router.post('/pin', (req, res) => {
  const { body } = req

  const guestPin = body.guestPin
  const guestSurname = body.guestSurname
  const roomName = body.roomName

  Customers.find({ $and: [{ guest_pin: guestPin }, { last_name: guestSurname }, { room_name: roomName }, { checked_in: true }]}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});


//  @route  POST api/customers/checkin
//  @desc   Guest check in.
//  @access Public
router.post('/checkin', (req, res) => {
  const { body } = req

  const customerID = mongoose.Types.ObjectId(body.guestID);

  Customers.findByIdAndUpdate({ _id: customerID }, {
    $set: {
      checked_in: true
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

//  @route  POST api/customers/payment
//  @desc   Sums room charge amount after payment.
//  @access Public
router.post('/payment', (req, res) => {
  const { body } = req

  const customerID = mongoose.Types.ObjectId(body.customerID);
  const totalPrice = body.totalPrice

  Customers.findOneAndUpdate({ $and: [{ _id: customerID }, { checked_in: true }]}, {
    $set: {
      room_charge_cost: totalPrice
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

//  @route  DELETE api/customers/remove
//  @desc   Remove customer by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const customerID = mongoose.Types.ObjectId(body.customerID);

  Customers.findByIdAndDelete({ _id: customerID }).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result })
  });

});

//  @route   POST api/customers/amend
//  @desc    Amend a customer by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const customerID = mongoose.Types.ObjectId(body.customerID);

  Customers.findByIdAndUpdate({ _id: customerID }, {
    $set: {
      first_name: body.firstName,
      last_name: body.lastName,
      gender: body.gender,
      email: body.email,
      telephone_number: body.telNumber,
      credit_card_number: body.creditCardNum
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

module.exports = router;