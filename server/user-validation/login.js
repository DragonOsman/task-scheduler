const Validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginInput = data => {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Username checks
  const usernameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  if (Validator.isEmpty(data.username)) {
    errors.email = "Username field is required";
  } else if (!Validator.matches(data.username, usernameRegex)) {
    errors.email = "Username is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLoginInput;