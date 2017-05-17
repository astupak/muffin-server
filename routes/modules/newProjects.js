const Project = require('../../models/project');

module.exports.get = async function(id) {
  const project = await Project.findById(id);

  return project;
};
