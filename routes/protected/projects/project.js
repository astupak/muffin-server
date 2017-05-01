const Project = require('../../../models/project');

module.exports.create = async function(ctx, next) {
  let project = new Project({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  

  let savedProject = await project.save();
    
  ctx.status = 201;
  ctx.body = savedProject.toObject();
};

module.exports.read = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  ctx.status = 200;
  ctx.body = project;
};

module.exports.list = async function(ctx, next) {
  const projects = await Project.find({
    
  });

  ctx.status = 200;
  ctx.body = projects;
};

