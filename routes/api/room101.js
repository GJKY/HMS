const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Room101 Model
const Room101 = require('../../models/Room101');

//  @route   POST api/room101/ambiance
//  @desc    Amend room ambiance.
//  @access  Public
router.post('/ambiance', (req, res) => {

  const { body } = req
  const ID = mongoose.Types.ObjectId('5cb483e90d60da969ea47ae6');

  Room101.findOneAndUpdate({ _id: ID }, {
    $set: {
      room_temperature: body.roomTemp, bathroom_lighting: body.lightOne, bedroom_lighting: body.lightTwo
    }}).then((error, result) => {
      if (error){
        return res.json({ success: false, error: error });
      }
  
    return res.json({ success: true, result: result });
    });
  
  });

//  @route   POST api/room101/temp
//  @desc    Amend room temperature.
//  @access  Public
router.post('/temp', (req, res) => {

  const { body } = req
  const ID = mongoose.Types.ObjectId('5cb483e90d60da969ea47ae6');

  Room101.findOneAndUpdate({ _id: ID }, {
    $set: {
      room_temperature: body.roomTemp
    }}).then((error, result) => {
      if (error){
        return res.json({ success: false, error: error });
      }
  
    return res.json({ success: true, result: result });
    });
  
  });

//  @route   POST api/room101/bathlight
//  @desc    Amend bathroom lighting.
//  @access  Public
router.post('/bathlight', (req, res) => {

  const { body } = req
  const ID = mongoose.Types.ObjectId('5cb483e90d60da969ea47ae6');

  Room101.findOneAndUpdate({ _id: ID }, {
    $set: {
      bathroom_lighting: body.lightOne
    }}).then((error, result) => {
      if (error){
        return res.json({ success: false, error: error });
      }
  
    return res.json({ success: true, result: result });
    });
  
  });

//  @route   POST api/room101/bedlight
//  @desc    Amend bedroom lighting.
//  @access  Public
router.post('/bedlight', (req, res) => {

  const { body } = req
  const ID = mongoose.Types.ObjectId('5cb483e90d60da969ea47ae6');

  Room101.findOneAndUpdate({ _id: ID }, {
    $set: {
      bedroom_lighting: body.lightTwo
    }}).then((error, result) => {
      if (error){
        return res.json({ success: false, error: error });
      }
  
    return res.json({ success: true, result: result });
    });
  
  });

//  @route   POST api/room101/music
//  @desc    Amend room music.
//  @access  Public
router.post('/music', (req, res) => {

  const { body } = req
  const ID = mongoose.Types.ObjectId('5cb483e90d60da969ea47ae6');

  Room101.findOneAndUpdate({ _id: ID }, {
    $set: {
      room_music: body.roomMusic,
      music_image: body.roomImage,
      music_name: body.musicName
    }}).then((error, result) => {
      if (error){
        return res.json({ success: false, error: error });
      }
  
    return res.json({ success: true, result: result });
    });
  
  });

//  @route  GET api/room101/all
//  @desc   Get all ambiance.
//  @access Public
router.get('/all', (req, res) => {

  Room101.find({}, (error, response) => {
    if (error) {
      return res.json({ success: false, error: error });
    }

  return res.json({ success: true, response: response });
  });

});

  module.exports = router;