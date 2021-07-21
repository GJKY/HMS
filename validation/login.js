const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.email = !isEmpty(data.email) ? data.email : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email address is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email address is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};