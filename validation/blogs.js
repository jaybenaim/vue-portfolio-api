const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateNewBlog(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.author)) {
    errors.author = "Author field is required";
  }

  if (Validator.isEmpty(data.content)) {
    errors.content = "Content field is required";
  }
  //  else if (!data.content.length > 200) {
  //   errors.summary = "The summary must be less than 200 characters";
  // }

  if (Validator.isEmpty(data.summary)) {
    errors.summary = "A summary is required";
  }

  // if (!Validator.isEmpty(data.isCreator)) { 
  //   errors.isCreator = "You cannot edit this field"
  // }

  // if (!Validator.isUrl(data.image)) {
  //   errors.image = "This must be a valid url"
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
