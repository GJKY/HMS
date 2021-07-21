const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load StaffDetails & Staff Model
const StaffDetails = require('../../models/StaffDetails');
const Staff = require('../../models/Staff');

//  @route  POST api/staffdetails/create
//  @desc   Create staffdetails.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const staffID = mongoose.Types.ObjectId(body.staffID);

  const staffDetails = {
    _id: mongoose.Types.ObjectId(),
    email: body.emailAddress,
    password: body.password,
    staff_member: staffID
  }

  StaffDetails.create(staffDetails, (error, response) => {
    if (error) {
      
    }
  });

  Staff.findOneAndUpdate({ _id: staffID }, {
    $push: {
      staff_details: staffDetails._id
    }}).then((error, result) => {
      if (error){
        
      }
    });

  res.status(200).send({ success: true })

});

//  @route  GET api/staffdetails/all
//  @desc   Return all staffdetails.
//  @access Public
router.get('/all', (req, res) => {

  StaffDetails.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/staffdetails/remove
//  @desc   Remove staffdetails by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const staffDetailsID = mongoose.Types.ObjectId(body.staffDetailsID);
  const staffID = mongoose.Types.ObjectId(body.staffID);

  Staff.findOneAndUpdate({ _id: staffID }, {
    $pull: {
      staff_details: staffDetailsID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  StaffDetails.findByIdAndDelete({ _id: staffDetailsID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/staffdetails/amend
//  @desc    Amend staffdetails by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const staffDetailsID = mongoose.Types.ObjectId(body.staffDetailsID);
  const oldStaffID = mongoose.Types.ObjectId(body.oldStaffID);
  const newStaffID = mongoose.Types.ObjectId(body.newStaffID);

  Staff.findOneAndUpdate({ _id: oldStaffID }, {
    $pull: {
      staff_details: staffDetailsID
    }}).then((error, result) => {
      if (error){
        
      }
    });

    Staff.findOneAndUpdate({ _id: newStaffID }, {
      $push: {
        staff_details: staffDetailsID
      }}).then((error, result) => {
        if (error){
          
        }
      });

  StaffDetails.findByIdAndUpdate({ _id: staffDetailsID }, {
    $set: {
      email: body.emailAddress,
      password: body.password,
      staff_member: newStaffID
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;