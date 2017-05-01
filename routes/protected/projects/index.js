const Router = require('koa-router');
const {
  create,
  read,
  list,
  update,
} = require('./project');

const router = new Router();

router.post('/projects', create);
router.get('/projects', list);

router.get('/projects/:projectId', read);
router.patch('/projects/:projectId', update);


module.exports = router;
