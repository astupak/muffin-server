const Story = require('../../../models/story');
const Task = require('../../../models/task');

module.exports.create = async function(ctx, next) {
  const story = await Story.findById(ctx.params.storyId);
  
  let task = new Task({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedTask = await task.save();

  story.tasks.push(task._id);

  await story.save();
  
  ctx.status = 201;
  ctx.body = savedTask.toObject();
};

module.exports.read = async function(ctx, next) {
  const task = await Task.findById(ctx.params.taskId);

  ctx.status = 200;
  ctx.body = task;
};

module.exports.list = async function(ctx, next) {
  const { tasks } = await Story.findById(ctx.params.storyId).populate('tasks');

  ctx.status = 200;
  ctx.body = tasks;
};

