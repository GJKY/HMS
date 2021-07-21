const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Beverages Model
const Beverages = require('../../models/Beverages');

//  @route  POST api/beverages/create
//  @desc   Create beverages.
//  @access Public
router.post('/create', (req, res) => {

  const { body } = req

  const beverages = {
    name: body.beverageName,
    ingredients: [body.ingredients],
    price: body.price,
    number_in_stock: body.stockAmount,
    alert_amount: body.alertAmount
  }

  Beverages.create(beverages, (error, response) => {
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

  const drinkID = mongoose.Types.ObjectId(body.drinkID)

  Beverages.findOne({ _id: { $eq: drinkID } }, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  GET api/beverages/all
//  @desc   Return all beverages.
//  @access Public
router.get('/all', (req, res) => {

  Beverages.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

//  @route  DELETE api/beverages/remove
//  @desc   Remove beverages by ID.
//  @access Public
router.delete('/remove', (req, res) => {

  const { body } = req

  const beveragesID = mongoose.Types.ObjectId(body.beveragesID);

  Beverages.findByIdAndDelete({ _id: beveragesID }).then((error, result) => {
    if (error){
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, result: result })
  });

});

//  @route   POST api/beverages/amend
//  @desc    Amend beverages by ID.
//  @access  Public
router.post('/amend', (req, res) => {

  const { body } = req

  const beveragesID = mongoose.Types.ObjectId(body.beveragesID);

  Beverages.findByIdAndUpdate({ _id: beveragesID }, {
    $set: {
      name: body.beveragesName,
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