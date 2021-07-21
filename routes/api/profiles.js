const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//  Load Validation
const validateProfileInput = require('../../validation/profiles');

//  Load Profile Model
const Profile = require('../../models/Profile');
//  Load User Model
const User = require('../../models/User');

//  @route  GET api/profiles
//  @desc   Get current users profile
//  @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['first_name', 'last_name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//  @route  POST api/profiles
//  @desc   Create or edit user profile
//  @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  //  Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  //  Skills array
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      // Update
      Profile.findByIdAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
    } else {
      // Create

      // Check if handle exists
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        }

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});


module.exports = router;