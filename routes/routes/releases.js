const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  getBacklog,
  addStory,
  removeStory,
  getSprints,
  addSprint,
  removeSprint,
  isAllowed,
  setState,
} = require('../middlewares/release');
const router = new Router();

router.post('/releases', create);

router.use('/releases/:releaseId', isAllowed, setState);

router.get('/releases/:releaseId', read);

router.patch('/releases/:releaseId', update);
router.delete('/releases/:releaseId', remove);

router.get('/releases/:releaseId/backlog', getBacklog);
router.put('/releases/:releaseId/backlog', addStory);

router.delete('/releases/:releaseId/backlog/:storyId', removeStory);

router.get('/releases/:releaseId/sprints', getSprints);
router.put('/releases/:releaseId/sprints', addSprint);

router.delete('/releases/:releaseId/sprints/:sprintId', removeSprint);


module.exports = router;
