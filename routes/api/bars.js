const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Bars & Departments Model
const Bars = require('../../models/Bars');
const Departments = require('../../models/Departments');

//  @route  POST api/bars/create
//  @desc   Create bar.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  const bars = {
    _id: mongoose.Types.ObjectId(),
    name: body.barName,
    food_menu: [],
    drinks_menu: [],
    epos: [],
    department: departmentID,
    staff: []
  }

  Bars.create(bars, (error, response) => {
    if (error) {
      
    }
  });

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $push: {
      department_bars: bars._id
    }}).then((error, result) => {
      if (error){
        
      }
    });

  res.status(200).send({ success: true })

});

//  @route  GET api/bars/all
//  @desc   Return all bars.
//  @access Public
router.get('/all', (req, res) => {

  Bars.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/bars/remove
//  @desc   Remove bar by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const barID = mongoose.Types.ObjectId(body.barID);
  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $pull: {
      department_bars: barID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  Bars.findByIdAndDelete({ _id: barID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/bars/amend
//  @desc    Amend bars by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const barID = mongoose.Types.ObjectId(body.barID);
  const oldDepartmentID = mongoose.Types.ObjectId(body.oldDepartmentID);
  const newDepartmentID = mongoose.Types.ObjectId(body.newDepartmentID);

  Departments.findOneAndUpdate({ _id: oldDepartmentID }, {
    $pull: {
      department_bars: barID
    }}).then((error, result) => {
      if (error){
        
      }
    });

    Departments.findOneAndUpdate({ _id: newDepartmentID }, {
      $push: {
        department_bars: barID
      }}).then((error, result) => {
        if (error){
          
        }
      });

  Bars.findByIdAndUpdate({ _id: barID }, {
    $set: {
      name: body.barName,
      department: newDepartmentID
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;