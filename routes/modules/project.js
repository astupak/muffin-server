const Project = require('../../models/project');
const pick = require('lodash/pick');
const without = require('lodash/without');

module.exports.create = async function(ctx, next) {
  let project = new Project({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedProject = await project.save();
  
  ctx.status = 201;
  ctx.body = savedProject.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  ctx.status = 200;
  ctx.body = project;

  return next();
};

module.exports.update = async function(ctx, next) {
  let project = await Project.findById(ctx.params.projectId);
  const changes = pick(ctx.request.body, Project.changeableFields);

  project = Object.assign(project, changes);

  await project.save();

  ctx.status = 200;
  ctx.body = project;

  return next();
};

module.exports.remove = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  if (project) {
    await project.remove();

    ctx.status = 200;
    ctx.body = project;

    return next();
  } else {
    ctx.throw(404);
  }
  
};

module.exports.addRelease = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  project.releases.push(ctx.body._id);

  await project.save();

  return next();
};

module.exports.removeRelease = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  project.releases = without(project.releases, ctx.body._id);

  await project.save();

  return next();
};

module.exports.getReleases = async function(ctx, next) {
  const { releases } = await Project.findById(ctx.params.projectId).populate('releases');

  ctx.status = 200;
  ctx.body = releases;

  return next();
};

module.exports.addSprint = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  project.sprints.push(ctx.body._id);

  await project.save();

  return next();
};

module.exports.removeSprint = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  project.sprints = without(project.sprints, ctx.body._id);

  await project.save();

  return next();
};

module.exports.getSprints = async function(ctx, next) {
  const { sprints } = await Project.findById(ctx.params.projectId).populate('sprints');

  ctx.status = 200;
  ctx.body = sprints;

  return next();
};
module.exports.addStory = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  project.backlog.push(ctx.body._id);

  await project.save();

  return next();
};

module.exports.removeStory = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);

  project.backlog = without(project.backlog, ctx.body._id);

  await project.save();

  return next();
};

module.exports.getBacklog = async function(ctx, next) {
  const { backlog } = await Project.findById(ctx.params.projectId).populate('backlog');

  ctx.status = 200;
  ctx.body = backlog;

  return next();
};
