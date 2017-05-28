const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  getBacklog,
  getReleases,
  getSprints,
  getBoards,
  isAllowed,
  setState,
} = require('../middlewares/project');
const router = new Router();

router.post('/projects', create);

router.use('/projects/:projectId', isAllowed, setState);

router.get('/projects/:projectId', read);

router.patch('/projects/:projectId', update);
router.delete('/projects/:projectId', remove);
router.get('/projects/:projectId/backlog', getBacklog);
router.get('/projects/:projectId/releases', getReleases);
router.get('/projects/:projectId/sprints', getSprints);
router.get('/projects/:projectId/boards', getBoards);

module.exports = router;
