const Sprint = require('../../models/sprint');
const Story = require('../../models/story');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {  
  let story = new Story({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedStory = await story.save();
  
  ctx.status = 201;
  ctx.body = savedStory.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const id = ctx.params.storyId || ctx.request.body.id;

  if (!id) {
    ctx.throw(400);
  }

  const story = await Story.findById(id);

  ctx.status = 200;
  ctx.body = story;

  return next();
};

module.exports.update = async function(ctx, next) {
  let story = await Story.findById(ctx.params.storyId);
  const changes = pick(ctx.request.body, Story.changeableFields);

  story = Object.assign(story, changes);

  await story.save();

  ctx.status = 200;
  ctx.body = story;

  return next();
};

module.exports.remove = async function(ctx, next) {
  const story = await Story.findById(ctx.params.storyId);
  
  await story.remove();

  ctx.status = 200;
  ctx.body = story;

  return next();
};
