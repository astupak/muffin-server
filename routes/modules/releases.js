const Release = require('../../models/release');

module.exports.create = async function(name, description) {
  const release = new Release({
    name,
    description,
  });
  
  let savedRelease = await release.save();

  return savedRelease;
};

module.exports.get = async function(id) {
  const release = await Release.findById(id);

  return release;
};

module.exports.remove = async function(id) {
  const release = await Release.findById(id);
  
  await release.remove();

  return release;
};