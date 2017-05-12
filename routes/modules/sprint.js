const Sprint = require('../../models/sprint');
const Release = require('../../models/release');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {  
  let sprint = new Sprint({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedSprint = await sprint.save();
  
  ctx.status = 201;
  ctx.body = savedSprint.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.params.sprintId);

  ctx.status = 200;
  ctx.body = sprint;

  return next();
};

module.exports.update = async function(ctx, next) {
  let sprint = await Sprint.findById(ctx.params.sprintId);
  const changes = pick(ctx.request.body, Sprint.changeableFields);

  sprint = Object.assign(sprint, changes);

  await sprint.save();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
};

module.exports.remove = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.params.sprintId);
  
  await sprint.remove();

  ctx.status = 200;
  ctx.body = sprint;

  return next();
};

module.exports.addStory = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.params.sprintId);

  if (sprint.backlog.indexOf(ctx.body._id) == -1) {
    sprint.backlog.push(ctx.body._id);
    
    await sprint.save();
  }

  return next();
};

module.exports.removeStory = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.params.sprintId);

  if (ctx.params.sprintId) {
    sprint = await Sprint.findById(ctx.params.sprintId);
    sprint.backlog = without(sprint.backlog, ctx.body._id);

    await sprint.save();
  } else {
    await Sprint.update({
      backlog: ctx.body._id
    }, {
      $pull: {
        backlog: ctx.body._id
      }
    });
  }
  
  return next();
};

module.exports.getBacklog = async function(ctx, next) {
  const { backlog } = await Sprint.findById(ctx.params.sprintId).populate('backlog');

  ctx.status = 200;
  ctx.body = backlog;

  return next();
};