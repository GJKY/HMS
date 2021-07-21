const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Leisure Model
const Leisure = require('../../models/Leisure');

//  @route  POST api/leisure/create
//  @desc   Create leisure figures.
//  @access Public
router.post('/create', (req, res) => {
  const leisure = {
    gym_users: 0,
    pool_users: 0,
    golf_users: 0
  }

  Leisure.create(leisure, (error, response) => {
    if (error) {

    }
  });

  res.status(200).send({ success: true })

});

//  @route  GET api/leisure/all
//  @desc   Return all leisure figures.
//  @access Public
router.get('/all', (req, res) => {

  Leisure.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route   POST api/leisure/figures
//  @desc    Amend leisure figures.
//  @access  Public
router.post('/figures', (req, res) => {

  const { body } = req

  Leisure.findOneAndUpdate({ _id: '5cd03a2a207a0d25f2d85464' }, {
    $set: {
      gym_users: body.gymUsers,
      pool_users: body.poolUsers,
      golf_users: body.golfUsers
    }}).then((error, result) => {
      if (error){
        return res.json({ success: false, error: error });
      }
  
    return res.json({ success: true, result: result });
    });
  
  });

module.exports = router;