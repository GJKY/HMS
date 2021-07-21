const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
  data.last_name = !isEmpty(data.last_name) ? data.last_name : '';

  if (!Validator.isLength(data.password, { min: 6, max: 15 })) {
    errors.password = 'Password must be between 6 and 15 characters';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Password confirmation is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email address is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email address is invalid';
  }

  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = 'First Name is required';
  }

  if (Validator.isEmpty(data.last_name)) {
    errors.last_name = 'Last Name is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};