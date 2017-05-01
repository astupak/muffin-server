const Sprint = require('../../../models/sprint');
const Story = require('../../../models/story');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.params.sprintId);
  
  let story = new Story({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedStory = await story.save();

  sprint.stories.push(story._id);

  await sprint.save();
  
  ctx.status = 201;
  ctx.body = savedStory.toObject();
};

module.exports.read = async function(ctx, next) {
  const story = await Story.findById(ctx.params.storyId);

  ctx.status = 200;
  ctx.body = story;
};

module.exports.update = async function(ctx, next) {
  let story = await Story.findById(ctx.params.storyId);
  const changes = pick(ctx.request.body, Story.changeableFields);

  story = Object.assign(story, changes);

  await story.save();

  ctx.status = 200;
  ctx.body = story;
};

module.exports.list = async function(ctx, next) {
  const { stories } = await Sprint.findById(ctx.params.sprintId).populate('stories');

  ctx.status = 200;
  ctx.body = stories;
};

