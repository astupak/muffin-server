const Project = require('../../models/project');

module.exports.create = async function(name, description) {
  const project = new Project({
    name,
    description,
  });
  
  let savedProject = await project.save();

  return savedProject;
};

module.exports.get = async function(id) {
  const project = await Project.findById(id);

  return project;
};

module.exports.remove = async function(id) {
  const project = await Project.findById(id);
  
  await project.remove();

  return project;
};