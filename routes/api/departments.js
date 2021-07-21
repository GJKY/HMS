const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Departments Model
const Departments = require('../../models/Departments');

//  @route  POST api/departments/create
//  @desc   Create a department.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const departments = {
    name: body.departmentName,
    department_staff: [],
    department_epos: [],
    department_bars: [],
    department_tables: []
  }

  Departments.create(departments, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/departments/all
//  @desc   Return all departments.
//  @access Public
router.get('/all', (req, res) => {

  Departments.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/departments/remove
//  @desc   Remove department by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  Departments.findByIdAndDelete({ _id: departmentID }).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result })
  });

});

//  @route   POST api/departments/amend
//  @desc    Amend a department by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  Departments.findByIdAndUpdate({ _id: departmentID }, {
    $set: {
      name: body.departmentName
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

module.exports = router;