const User = require('../../models/user');

module.exports.create = async function(email, displayName, password) {
  let user = new User({
    email,
    displayName,
    password
  });

  let savedUser = await user.save();

  return savedUser.toObject();
};