const Project = require('../../../models/project');
const Company = require('../../../models/company');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {
  const company = await Company.findOne({name: ctx.params.companyName});
  
  let project = new Project({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedProject = await project.save();

  company.projects.push(project._id);

  await company.save();
  
  ctx.status = 201;
  ctx.body = savedProject.toObject();
};

module.exports.read = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  ctx.status = 200;
  ctx.body = project;
};

module.exports.update = async function(ctx, next) {
  let project = await Project.findById(ctx.params.projectId);
  const changes = pick(ctx.request.body, Project.changeableFields);

  project = Object.assign(project, changes);

  await project.save();

  ctx.status = 200;
  ctx.body = project;
};


module.exports.list = async function(ctx, next) {
  const { projects } = await Company.findOne({name: ctx.params.companyName}).populate('projects');

  ctx.status = 200;
  ctx.body = projects;
};

