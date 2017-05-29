const pick = require('lodash/pick');
const Stories = require('../modules/stories');
const Projects = require('../modules/projects');

module.exports.create = async function (ctx, next) {
  const {name, description} = ctx.request.body;

  const story = await Stories.create(name, description);
  const {project} = ctx.state.elements;

  project.backlog.add(story._id);

  await project.save();

  ctx.status = 201;
  ctx.body = story;

  return next();
}

module.exports.read = async function (ctx, next) {
  const {story} = ctx.state.elements;

  ctx.status = 200;
  ctx.body = story;

  return next();
}

module.exports.update = async function (ctx, next) {
  const {story} = ctx.state.elements;

  story.update(pick(ctx.request.body, story.model('Story').changeableFields));

  await story.save();

  ctx.status = 200;
  ctx.body = story;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const story = await Stories.remove(ctx.params.storyId);
  const {project} = ctx.state.elements;

  project.backlog.remove(story._id);

  await project.save();

  ctx.status = 200;
  ctx.body = story;

  return next();
};

module.exports.estimate = async function (ctx, next) {
  const {story} = ctx.state.elements;

  story.setEstimation(ctx.request.body.estimation);

  await story.save();

  ctx.status = 200;
  ctx.body = story;

  return next();
}

module.exports.prioritize = async function (ctx, next) {
  const {story} = ctx.state.elements;

  story.setPriority(ctx.request.body.priority);

  await story.save();


  ctx.status = 200;
  ctx.body = story;

  return next();
}

module.exports.isAllowed = async function(ctx, next) {
  const allowedStories = ctx.state.allowed.stories;
  const {storyId} = ctx.params;

  if (allowedStories.indexOf(storyId) === -1) {
    ctx.throw(404);
  } else {
    console.log('story allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {storyId} = ctx.params;
  let {allowed} = ctx.state;

  const story = await Stories.get(storyId);

  ctx.state.elements.story = story;
  return next();
}

