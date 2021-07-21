const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Epos & Departments Model
const Epos = require('../../models/Epos');
const Departments = require('../../models/Departments');

//  @route  POST api/epos/create
//  @desc   Create epos.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  const epos = {
    _id: mongoose.Types.ObjectId(),
    name: body.eposName,
    department: departmentID,
    orders: []
  }

  Epos.create(epos, (error, response) => {
    if (error) {

    }
  });

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $push: {
      department_epos: epos._id
    }}).then((error, result) => {
      if (error){
        
      }
    });

  res.status(200).send({ success: true })

});

//  @route  GET api/epos/all
//  @desc   Return all epos.
//  @access Public
router.get('/all', (req, res) => {

  Epos.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/epos/getname
//  @desc   Get epos name by id.
//  @access Public
router.post('/getname', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.eposID);

  Epos.find({ _id: eposID }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/epos/remove
//  @desc   Remove epos by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.eposID);
  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $pull: {
      department_epos: eposID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  Epos.findByIdAndDelete({ _id: eposID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/epos/amend
//  @desc    Amend epos by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const eposID = mongoose.Types.ObjectId(body.eposID);
  const oldDepartmentID = mongoose.Types.ObjectId(body.oldDepartmentID);
  const newDepartmentID = mongoose.Types.ObjectId(body.newDepartmentID);

  Departments.findOneAndUpdate({ _id: oldDepartmentID }, {
    $pull: {
      department_epos: eposID
    }}).then((error, result) => {
      if (error){
        
      }
    });

    Departments.findOneAndUpdate({ _id: newDepartmentID }, {
      $push: {
        department_epos: eposID
      }}).then((error, result) => {
        if (error){
          
        }
      });

  Epos.findByIdAndUpdate({ _id: eposID }, {
    $set: {
      name: body.eposName,
      department: newDepartmentID
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;