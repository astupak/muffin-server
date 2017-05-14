const Router = require('koa-router');
const { 
  addStory: addToProject,
  removeStory: removeFromProject,
  getBacklog: getProjectBacklog
} = require('../modules/project');
const { 
  addStory: addToRelease,
  removeStory: removeFromRelease,
  getBacklog: getReleaseBacklog
} = require('../modules/release');
const { 
  addStory: addToSprint,
  removeStory: removeFromSprint,
  getBacklog: getSprintBacklog
} = require('../modules/sprint');
const {
  create,
  read: getStory,
  update,
  remove,
} = require('../modules/story');

const projectBacklogRouter = new Router();
const releaseBacklogRouter = new Router();
const sprintBacklogRouter = new Router();

projectBacklogRouter.post('/backlog', create, addToProject);
projectBacklogRouter.get('/backlog', getProjectBacklog);
projectBacklogRouter.get('/backlog/:storyId', getStory);
projectBacklogRouter.patch('/backlog/:storyId', update);
projectBacklogRouter.delete('/backlog/:storyId', remove, removeFromProject, removeFromRelease, removeFromSprint);

releaseBacklogRouter.put('/backlog', getStory, addToRelease);
releaseBacklogRouter.get('/backlog', getReleaseBacklog);
releaseBacklogRouter.delete('/backlog/:storyId', getStory, removeFromRelease);

sprintBacklogRouter.put('/backlog', getStory, addToSprint);
sprintBacklogRouter.get('/backlog', getSprintBacklog);
sprintBacklogRouter.delete('/backlog/:storyId', getStory, removeFromSprint);

module.exports = {
  projectBacklogRouter,
  releaseBacklogRouter,
  sprintBacklogRouter,
};
