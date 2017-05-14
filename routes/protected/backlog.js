const Router = require('koa-router');
const { 
  addStory: addStoryToProject,
  removeStory: removeStoryFromProject,
  getBacklog: getProjectBacklog
} = require('../modules/project');
const { 
  addStory: addStoryToRelease,
  removeStory: removeStoryFromRelease,
  getBacklog: getReleaseBacklog
} = require('../modules/release');
const { 
  addStory: addStoryToSprint,
  removeStory: removeStoryFromSprint,
  getBacklog: getSprintBacklog
} = require('../modules/sprint');
const {
  create,
  read,
  update,
  remove,
} = require('../modules/story');

const projectBacklogRouter = new Router();
const releaseBacklogRouter = new Router();
const sprintBacklogRouter = new Router();

projectBacklogRouter.post('/backlog', create, addStoryToProject);
projectBacklogRouter.get('/backlog', getProjectBacklog);

projectBacklogRouter.get('/backlog/:storyId', read);
projectBacklogRouter.patch('/backlog/:storyId', update);
projectBacklogRouter.delete('/backlog/:storyId', remove, removeStoryFromProject, removeStoryFromRelease, removeStoryFromSprint);


releaseBacklogRouter.put('/backlog', read, addStoryToRelease);
releaseBacklogRouter.get('/backlog', getReleaseBacklog);

releaseBacklogRouter.delete('/backlog/:storyId', read, removeStoryFromRelease, removeStoryFromSprint);


sprintBacklogRouter.put('/backlog', read, addStoryToRelease, addStoryToSprint);
sprintBacklogRouter.get('/backlog', getSprintBacklog);

sprintBacklogRouter.delete('/backlog/:storyId', read, removeStoryFromSprint);

module.exports = {
  projectBacklogRouter,
  releaseBacklogRouter,
  sprintBacklogRouter,
};
