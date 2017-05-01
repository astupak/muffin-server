const Router = require('koa-router');
const {
  create,
  read,
  update,
  list,
} = require('./task');

const router = new Router();

router.post('/tasks', create);
router.get('/tasks', list);

router.get('/tasks/:taskId', read);
router.patch('/tasks/:taskId', update);

module.exports = router;
