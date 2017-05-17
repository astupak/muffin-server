const Sprint = require('../../models/sprint');

module.exports.get = async function(id) {
  const sprint = await Sprint.findById(id);

  return sprint;
};
