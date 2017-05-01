const Sprint = require('../../../models/sprint');
const Release = require('../../../models/release');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);
  
  let sprint = new Sprint({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedSprint = await sprint.save();

  release.sprints.push(sprint._id);

  await release.save();
  
  ctx.status = 201;
  ctx.body = savedSprint.toObject();
};

module.exports.read = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.params.sprintId);

  ctx.status = 200;
  ctx.body = sprint;
};

module.exports.update = async function(ctx, next) {
  let sprint = await Sprint.findById(ctx.params.sprintId);
  const changes = pick(ctx.request.body, Sprint.changeableFields);

  sprint = Object.assign(sprint, changes);

  await sprint.save();

  ctx.status = 200;
  ctx.body = sprint;
};

module.exports.list = async function(ctx, next) {
  const { sprints } = await Release.findById(ctx.params.releaseId).populate('sprints');

  ctx.status = 200;
  ctx.body = sprints;
};

