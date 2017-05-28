const Story = require('../../models/story');

module.exports.create = async function(name, description) {
  const story = new Story({
    name,
    description,
  });
  
  let savedStory = await story.save();

  return savedStory;
};

module.exports.get = async function(id) {
  const story = await Story.findById(id);

  return story;
};

module.exports.remove = async function(id) {
  const story = await Story.findById(id);
  
  await story.remove();

  return story;
};