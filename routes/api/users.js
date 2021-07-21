const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//  Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//  Load User Model
const User = require('../../models/User');

//  @route  POST api/users/register
//  @desc   Register a new user
//  @access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

//  @route  POST api/users/login
//  @desc   User login & JWT
//  @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if(!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          const payload = { id: user.id, first_name: user.first_name, last_name: user.last_name }
          // Generate JWT
          jwt.sign(
            payload, keys.secretOrKey,
             { expiresIn: 3600 },
             (err, token) => {
               res.json({
                 success: true,
                 token: 'Bearer ' + token
               });
             });
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
});

//  @route  GET api/users/current
//  @desc   Return current user
//  @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name
    });
}
);

module.exports = router;