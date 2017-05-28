const Sprint = require('../../models/sprint');

module.exports.create = async function(name, description) {
  const sprint = new Sprint({
    name,
    description,
  });
  
  let savedSprint = await sprint.save();

  return savedSprint;
};

module.exports.get = async function(id) {
  const sprint = await Sprint.findById(id);

  return sprint;
};

module.exports.remove = async function(id) {
  const sprint = await Sprint.findById(id);
  
  await sprint.remove();

  return sprint;
};