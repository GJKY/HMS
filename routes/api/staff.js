const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Staff & Departments Model
const Staff = require('../../models/Staff');
const Departments = require('../../models/Departments');

//  @route  POST api/staff/create
//  @desc   Create staff member.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  const staff = {
    _id: mongoose.Types.ObjectId(),
    first_name: body.firstName,
    last_name: body.lastName,
    department: departmentID,
    staff_details: [],
    epos_login: body.eposLogin,
    management_code: body.managementCode
  }

  Staff.create(staff, (error, response) => {
    if (error) {
      
    }
  });

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $push: {
      department_staff: staff._id
    }}).then((error, result) => {
      if (error){
        
      }
    });

  res.status(200).send({ success: true })

});

//  @route  POST api/staff/login
//  @desc   Staff login to epos.
//  @access Public
router.post('/login', (req, res) => {

  const { body } = req

  const deskLogin = body.eposLogin

  Staff.findOne({ epos_login: { $eq: deskLogin } }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  })

})

//  @route  POST api/staff/management
//  @desc   Management authorisation.
//  @access Public
router.post('/management', (req, res) => {

  const { body } = req

  const managementCode = body.managementCode

  Staff.findOne({ management_code: { $eq: managementCode } }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  })

})

//  @route  GET api/staff/all
//  @desc   Return all staff members.
//  @access Public
router.get('/all', (req, res) => {

  Staff.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/staff/remove
//  @desc   Remove staff by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const staffID = mongoose.Types.ObjectId(body.staffID);
  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $pull: {
      department_staff: staffID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  Staff.findByIdAndDelete({ _id: staffID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/staff/amend
//  @desc    Amend staff by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const staffID = mongoose.Types.ObjectId(body.staffID);
  const oldDepartmentID = mongoose.Types.ObjectId(body.oldDepartmentID);
  const newDepartmentID = mongoose.Types.ObjectId(body.newDepartmentID);

  Departments.findOneAndUpdate({ _id: oldDepartmentID }, {
    $pull: {
      department_staff: staffID
    }}).then((error, result) => {
      if (error){
        
      }
    });

    Departments.findOneAndUpdate({ _id: newDepartmentID }, {
      $push: {
        department_staff: staffID
      }}).then((error, result) => {
        if (error){
          
        }
      });

  Staff.findByIdAndUpdate({ _id: staffID }, {
    $set: {
      first_name: body.firstName,
      last_name: body.lastName,
      department: newDepartmentID,
      epos_login: body.eposLogin,
      management_code: body.managementCode
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;