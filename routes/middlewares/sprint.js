const pick = require('lodash/pick');
const Sprints = require('../modules/projects');
const Projects = require('../modules/companies');

module.exports.create = async function (ctx, next) {
  const {name, description} = ctx.request.body;

  const sprint = await Sprints.create(name, description);
  const project = await Projects.get(ctx.params.projectId);

  project.sprints.add(sprint._id);

  await project.save();

  ctx.status = 201;
  ctx.body = sprint;

  return next();
}

module.exports.read = async function (ctx, next) {
  const sprint = await Sprints.get(ctx.params.sprintId);

  ctx.status = 200;
  ctx.body = sprint;

  return next();
}

module.exports.update = async function (ctx, next) {
  const sprint = await Sprints.get(ctx.params.sprintId);

  sprint.update(pick(ctx.request.body, sprint.model('Project').changeableFields));

  await sprint.save();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const sprint = await Sprints.remove(ctx.params.sprintId);
  
  ctx.status = 200;
  ctx.body = sprint;

  return next();
};

module.exports.getBacklog = async function (ctx, next) {
  const sprint = await Sprints.get(ctx.params.sprintId);
  const { storiesList: backlog } =  await sprint.backlog.list();

  ctx.status = 200;
  ctx.body = backlog;

  return next();
};

module.exports.addStory = async function (ctx, next) {
  const sprint = await Sprints.get(ctx.params.sprintId);
  
  sprint.backlog.add(ctx.request.body.story);
  
  await sprint.save();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
};
