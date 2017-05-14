const Release = require('../../models/release');
const Project = require('../../models/project');
const without = require('lodash/without');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {
  let release = new Release({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedRelease = await release.save();
  
  ctx.status = 201;
  ctx.body = savedRelease.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);

  ctx.status = 200;
  ctx.body = release;

  return next();
};

module.exports.update = async function(ctx, next) {
  let release = await Release.findById(ctx.params.releaseId);
  const changes = pick(ctx.request.body, Release.changeableFields);

  release = Object.assign(release, changes);

  await release.save();

  ctx.status = 200;
  ctx.body = release;

  return next();
};

module.exports.remove = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);
  
  await release.remove();

  ctx.status = 200;
  ctx.body = release;

  return next();
};

module.exports.addSprint = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);

  release.sprints.push(ctx.body._id);

  await release.save();

  return next();
};

module.exports.removeSprint = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);

  release.sprints = without(release.sprints, ctx.body._id);

  await release.save();

  return next();
};

module.exports.getSprints = async function(ctx, next) {  
  let release;

  if (ctx.request.body.populated) {
    release = await Release.findById(ctx.params.releaseId).populate('sprints');
  } else {
    release = await Release.findById(ctx.params.releaseId);
  }

  ctx.status = 200;
  ctx.body = release.sprints;

  return next();
};

module.exports.addStory = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);

  if (release.backlog.indexOf(ctx.body._id) == -1) {
    release.backlog.push(ctx.body._id);
    
    await release.save();
  }

  return next();
};

module.exports.removeStory = async function(ctx, next) {
  let release;

  if (ctx.params.releaseId) {
     await Release.update({
      _id: ctx.params.releaseId
    }, {
      $pull : {
        backlog: ctx.body._id
      }
    });
  } else {
    await Release.update({
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
  let release;

  if (ctx.request.body.populated) {
    release = await Release.findById(ctx.params.releaseId).populate('backlog');
  } else {
    release = await Release.findById(ctx.params.releaseId);
  }

  ctx.status = 200;
  ctx.body = release.backlog;

  return next();
};
