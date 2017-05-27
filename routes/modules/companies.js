const without = require('lodash/without');
const pick = require('lodash/pick');
const Company = require('../../models/company');
const User = require('../../models/user');

module.exports.create = async function(name) {
  const company = new Company({
    name,
  });
  
  let savedCompany = await company.save();

  return savedCompany;
};

module.exports.get = async function(id) {
  const company = await Company.findById(id);

  return company;
};

module.exports.remove = async function(id) {
  const company = await Company.findById(id);
  
  await company.remove();

  return company;
};


