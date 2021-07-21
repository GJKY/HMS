const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Tables & Departments Model
const Tables = require('../../models/Tables');
const Departments = require('../../models/Departments');

//  @route  POST api/tables/create
//  @desc   Create tables.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  const tables = {
    _id: mongoose.Types.ObjectId(),
    table_number: body.tableNumber,
    department: departmentID,
    is_empty: true,
    size: body.tableSize
  }

  Tables.create(tables, (error, response) => {
    if (error) {

    }
  });

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $push: {
      department_tables: tables._id
    }}).then((error, result) => {
      if (error){
        
      }
    });

  res.status(200).send({ success: true })

});

//  @route  POST api/tables/search
//  @desc   Returns table details from ID.
//  @access Public
router.post('/search', (req, res) => {

  const { body } = req

  const tableID = mongoose.Types.ObjectId(body.tableID)

  Tables.findOne({ _id: { $eq: tableID } }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/tables/all
//  @desc   Return all tables.
//  @access Public
router.get('/all', (req, res) => {

  Tables.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/tables/remove
//  @desc   Remove tables by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const tablesID = mongoose.Types.ObjectId(body.tablesID);
  const departmentID = mongoose.Types.ObjectId(body.departmentID);

  Departments.findOneAndUpdate({ _id: departmentID }, {
    $pull: {
      department_tables: tablesID
    }}).then((error, result) => {
      if (error){
        
      }
    });

  Tables.findByIdAndDelete({ _id: tablesID }).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

//  @route   POST api/tables/amend
//  @desc    Amend tables by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const tablesID = mongoose.Types.ObjectId(body.tablesID);
  const oldDepartmentID = mongoose.Types.ObjectId(body.oldDepartmentID);
  const newDepartmentID = mongoose.Types.ObjectId(body.newDepartmentID);

  Departments.findOneAndUpdate({ _id: oldDepartmentID }, {
    $pull: {
      department_tables: tablesID
    }}).then((error, result) => {
      if (error){
        
      }
    });

    Departments.findOneAndUpdate({ _id: newDepartmentID }, {
      $push: {
        department_tables: tablesID
      }}).then((error, result) => {
        if (error){
          
        }
      });

  Tables.findByIdAndUpdate({ _id: tablesID }, {
    $set: {
      table_number: body.tableNumber,
      size: body.tableSize,
      department: newDepartmentID
    }}).then((error, result) => {
    if (error){

    }
  });

  res.status(200).send({ success: true })

});

module.exports = router;