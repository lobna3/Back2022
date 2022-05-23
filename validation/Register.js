const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function ValidateRegister(data) {
  let errors = {};

  data.nom = !isEmpty(data.nom) ? data.nom : "";
  data.prenom = !isEmpty(data.prenom) ? data.prenom : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.numTelp = !isEmpty(data.numTelp) ? data.numTelp : "";
  data.confirm = !isEmpty(data.confirm) ? data.confirm : "";

  if (validator.isEmpty(data.nom)) {
    errors.nom = "Required nom";
  }
  if (validator.isEmpty(data.prenom)) {
    errors.prenom = "Required prenom";
  }
  if (validator.isEmpty(data.numTelp)) {
    errors.numTelp = "Required numTel";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Required format email";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Required email";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Required password";
  }
  if(!validator.equals(data.password, data.confirm)){
    errors.confirm = "Passwords not matches";
  }
  if (validator.isEmpty(data.confirm)) {
    errors.confirm = "Required confirm";
  }
  


  return {
      errors,
      isValid: isEmpty(errors)
  }
};