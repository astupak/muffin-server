const pick = require('lodash/pick');
const Projects = require('../modules/projects');
const Companies = require('../modules/companies');

module.exports.create = async function (ctx, next) {
  const {name, description} = ctx.request.body;
  const project = await Projects.create(name, description);
  const company = await Companies.get(ctx.params.companyId);

  company.projects.add(project._id);

  await company.save();

  ctx.status = 201;
  ctx.body = project;

  return next();
}

module.exports.read = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);

  ctx.status = 200;
  ctx.body = project;

  return next();
}

module.exports.update = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);

  project.update(pick(ctx.request.body, project.model('Project').changeableFields));

  await project.save();

  ctx.status = 200;
  ctx.body = project;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const project = await Projects.remove(ctx.params.projectId);
  
  ctx.status = 200;
  ctx.body = project;

  return next();
};

module.exports.getBacklog = async function (ctx, next) {
 const project = await Projects.get(ctx.params.projectId);
  const { storiesList: backlog } =  await project.backlog.list();
  
  ctx.status = 200;
  ctx.body = backlog;

  return next();
};

module.exports.getReleases = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);
  const { releasesList: releases } =  await project.releases.list();

  ctx.status = 200;
  ctx.body = releases;

  return next();
};

module.exports.getSprints = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);
  const { sprintsList: sprints } =  await project.sprints.list();
  
  ctx.status = 200;
  ctx.body = sprints;

  return next();
};

module.exports.getBoards = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);
  const { boardsList: boards } =  await project.boards.list();
  
  ctx.status = 200;
  ctx.body = boards;

  return next();
}