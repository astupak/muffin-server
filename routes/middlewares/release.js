const pick = require('lodash/pick');
const Releases = require('../modules/releases');
const Projects = require('../modules/projects');

module.exports.create = async function (ctx, next) {
  const {name, description} = ctx.request.body;

  const release = await Releases.create(name, description);
  const {project} = ctx.state.elements;

  project.releases.add(release._id);

  await project.save();

  ctx.status = 201;
  ctx.body = release;

  return next();
}

module.exports.read = async function (ctx, next) {
  const {release} = ctx.state.elements;

  ctx.status = 200;
  ctx.body = release;

  return next();
}

module.exports.update = async function (ctx, next) {
  const {release} = ctx.state.elements;

  release.update(pick(ctx.request.body, release.model('Release').changeableFields));

  await release.save();

  ctx.status = 200;
  ctx.body = release;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const release = await Releases.remove(ctx.params.releaseId);
  const {project} = ctx.state.elements;

  project.releases.remove(release._id);

  await project.save();

  ctx.status = 200;
  ctx.body = release;

  return next();
};

module.exports.getBacklog = async function (ctx, next) {
  const {release} = ctx.state.elements;
  const { storiesList: backlog } =  await release.backlog.list();

  ctx.status = 200;
  ctx.body = backlog;

  return next();
};

module.exports.addStory = async function (ctx, next) {
  const {release, project} = ctx.state.elements;
  
  if (project.storiesList.indexOf(ctx.request.body.story) !== -1) {
    release.backlog.add(ctx.request.body.story);
    
    await release.save();

    ctx.status = 200;
    ctx.body = release;
  } else {
    ctx.throw(400);
  }

  return next();
};

module.exports.removeStory = async function (ctx, next) {
  const {release} = ctx.state.elements;
  
  release.backlog.remove(parseInt(ctx.params.storyId));
  await release.save();

  ctx.status = 200;
  ctx.body = release;

  return next();
};

module.exports.getSprints = async function (ctx, next) {
  const {release} = ctx.state.elements;
  const { sprintsList: sprints } =  await release.sprints.list();

  ctx.status = 200;
  ctx.body = sprints;

  return next();
};

module.exports.addSprint = async function (ctx, next) {
  const {release, project} = ctx.state.elements;
  
  if (project.sprintsList.indexOf(ctx.request.body.sprint) !== -1) {
    release.sprints.add(ctx.request.body.sprint);
    
    await release.save();

    ctx.status = 200;
    ctx.body = release;
  } else {
    console.log(123);
    ctx.throw(400);
  }

  return next();
};

module.exports.removeSprint = async function (ctx, next) {
  const {release} = ctx.state.elements
  
  release.sprints.remove(parseInt(ctx.params.sprintId));
  await release.save();

  ctx.status = 200;
  ctx.body = release;

  return next();
};

module.exports.isAllowed = async function(ctx, next) {
  const allowedReleases = ctx.state.allowed.releases;
  const {releaseId} = ctx.params;

  if (allowedReleases.indexOf(releaseId) === -1) {
    ctx.throw(404);
  } else {
    console.log('release allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {releaseId} = ctx.params;
  let {allowed} = ctx.state;

  const release = await Releases.get(releaseId);

  const {
    sprintsList: sprints,
    storiesList: stories,  
  } = release;

  ctx.state.allowed = Object.assign(allowed, {
    sprints,
    stories
  });

  ctx.state.elements.release = release;
  return next();
}

