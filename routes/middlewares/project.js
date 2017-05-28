const pick = require('lodash/pick');
const Projects = require('../modules/projects');
const Companies = require('../modules/companies');

module.exports.create = async function (ctx, next) {
  const {name, description} = ctx.request.body;
  const project = await Projects.create(name, description);
  const {company} = ctx.state.elements;

  company.projects.add(project._id);

  await company.save();

  ctx.status = 201;
  ctx.body = project;

  return next();
}

module.exports.read = async function (ctx, next) {
  const {project} = ctx.state.elements;

  ctx.status = 200;
  ctx.body = project;

  return next();
}

module.exports.update = async function (ctx, next) {
  const {project} = ctx.state.elements;

  project.update(pick(ctx.request.body, project.model('Project').changeableFields));

  await project.save();

  ctx.status = 200;
  ctx.body = project;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const {project, company} = ctx.state.elements;

  company.projects.remove(project._id);

  await company.save();

  ctx.status = 200;
  ctx.body = project;

  return next();
};

module.exports.getBacklog = async function (ctx, next) {
  const {project} = ctx.state.elements;
  const { storiesList: backlog } =  await project.backlog.list();
  
  ctx.status = 200;
  ctx.body = backlog;

  return next();
};

module.exports.getReleases = async function (ctx, next) {
  const {project} = ctx.state.elements;
  const { releasesList: releases } =  await project.releases.list();

  ctx.status = 200;
  ctx.body = releases;

  return next();
};

module.exports.getSprints = async function (ctx, next) {
  const {project} = ctx.state.elements;
  const { sprintsList: sprints } =  await project.sprints.list();
  
  ctx.status = 200;
  ctx.body = sprints;

  return next();
};

module.exports.getBoards = async function (ctx, next) {
  const {project} = ctx.state.elements;
  const { boardsList: boards } =  await project.boards.list();
  
  ctx.status = 200;
  ctx.body = boards;

  return next();
}

module.exports.isAllowed = async function(ctx, next) {
  const allowedProjects = ctx.state.allowed.projects;
  const {projectId} = ctx.params;

  if (allowedProjects.indexOf(projectId) === -1) {
    ctx.throw(404);
  } else {
    console.log('project allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {projectId} = ctx.params;
  let {allowed} = ctx.state;

  const project = await Projects.get(projectId);

  const {
    boardsList: boards,
    releasesList: releases,
    sprintsList: sprints,
    storiesList: stories,  
  } = project;

  allowed = Object.assign(allowed, {
    boards,
    releases,
    sprints,
    stories
  });

  ctx.state.elements.project = project;
  return next();
}
