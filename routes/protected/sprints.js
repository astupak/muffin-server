const Router = require('koa-router');
const {
  addSprint: addToProject,
  removeSprint: removeFromProject,
  getSprints: getProjectSprints,
} = require('../modules/project');
const {
  addSprint: addToRelease,
  removeSprint: removeFromRelease,
  getSprints: getReleaseSprints,
} = require('../modules/release');
const {
  create,
  read: getSprint,
  update,
  remove,
} = require('../modules/sprint');

const sprintsRouter = new Router();
const releaseSprintRouter = new Router();

sprintsRouter.post('/sprints', create, addToProject);
sprintsRouter.get('/sprints', getProjectSprints);
sprintsRouter.get('/sprints/:sprintId', getSprint);
sprintsRouter.patch('/sprints/:sprintId', update);
sprintsRouter.delete('/sprints/:sprintId', remove, removeFromProject, removeFromRelease);

releaseSprintRouter.put('/sprints', getSprint, addToRelease);
releaseSprintRouter.get('/sprints', getReleaseSprints);
releaseSprintRouter.delete('/sprints/:sprintId', getSprint, removeFromRelease);

module.exports = {
  sprintsRouter,
  releaseSprintRouter
};
