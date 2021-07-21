const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Food Model
const Food = require('../../models/Food');

//  @route  POST api/food/create
//  @desc   Create food.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const food = {
    name: body.foodName,
    ingredients: [body.ingredients],
    price: body.price,
    number_in_stock: body.stockAmount,
    alert_amount: body.alertAmount
  }

  Food.create(food, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  POST api/food/search
//  @desc   Returns food details from ID.
//  @access Public
router.post('/search', (req, res) => {

  const { body } = req

  const foodID = mongoose.Types.ObjectId(body.foodID)

  Food.findOne({ _id: { $eq: foodID } }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/food/all
//  @desc   Return all food.
//  @access Public
router.get('/all', (req, res) => {

  Food.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/food/remove
//  @desc   Remove food by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const foodID = mongoose.Types.ObjectId(body.foodID);

  Food.findByIdAndDelete({ _id: foodID }).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result })
  });

});

//  @route   POST api/food/amend
//  @desc    Amend food by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const foodID = mongoose.Types.ObjectId(body.foodID);

  Food.findByIdAndUpdate({ _id: foodID }, {
    $set: {
      name: body.foodName,
      ingredients: [body.ingredients],
      price: body.price,
      number_in_stock: body.newAmount
    }}).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result });
  });

});

module.exports = router;