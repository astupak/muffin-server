const pick = require('lodash/pick');
const Sprints = require('../modules/sprints');
const Projects = require('../modules/projects');

module.exports.create = async function (ctx, next) {
  const {name, description} = ctx.request.body;

  const sprint = await Sprints.create(name, description);
  const {project} = ctx.state.elements;

  project.sprints.add(sprint._id);

  await project.save();

  ctx.status = 201;
  ctx.body = sprint;

  return next();
}

module.exports.read = async function (ctx, next) {
  const {sprint} = ctx.state.elements;
  
  ctx.status = 200;
  ctx.body = sprint;

  return next();
}

module.exports.update = async function (ctx, next) {
  const {sprint} = ctx.state.elements;

  sprint.update(pick(ctx.request.body, sprint.model('Sprint').changeableFields));

  await sprint.save();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const sprint = await Sprints.remove(ctx.params.sprintId);
  const {project} = ctx.state.elements;

  project.sprints.remove(sprint._id);

  await project.save();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
};

module.exports.getBacklog = async function (ctx, next) {
  const {sprint} = ctx.state.elements;
  const { storiesList: backlog } =  await sprint.backlog.list();

  ctx.status = 200;
  ctx.body = backlog;

  return next();
};

module.exports.addStory = async function (ctx, next) {
  const {sprint, project} = ctx.state.elements;

  if (project.storiesList.indexOf(ctx.request.body.story) !== -1) {
    sprint.backlog.add(ctx.request.body.story);
    
    await sprint.save();

    ctx.status = 200;
    ctx.body = sprint;
  } else {
    ctx.throw(400);
  }

  return next();
};

module.exports.removeStory = async function (ctx, next) {
  const {sprint} = ctx.state.elements;
  
  sprint.backlog.remove(parseInt(ctx.params.storyId));
  await sprint.save();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
};

module.exports.isAllowed = async function(ctx, next) {
  const allowedSprints = ctx.state.allowed.sprints;
  const {sprintId} = ctx.params;

  if (allowedSprints.indexOf(sprintId) === -1) {
    ctx.throw(404);
  } else {
    console.log('sprint allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {sprintId} = ctx.params;
  let {allowed} = ctx.state;

  const sprint = await Sprints.get(sprintId);

  const {
    storiesList: stories,  
  } = sprint;

  allowed = Object.assign(allowed, {
    stories
  });

  ctx.state.elements.sprint = sprint;
  return next();
}

