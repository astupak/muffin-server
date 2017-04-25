const Router = require('koa-router');
const {
  create: createProject,
  read: readProject,
  list: listProjects,
} = require('./project');

const router = new Router();

router.post('/projects', createProject);
router.get('/projects', listProjects);

router.get('/projects/:projectId', readProject);

module.exports = router;
