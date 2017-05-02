const Router = require('koa-router');
const {
  create,
  read,
  list,
  update,
  remove,
} = require('./task');

const router = new Router();

router.post('/tasks', create);
router.get('/tasks', list);

router.get('/tasks/:taskId', read);
router.patch('/tasks/:taskId', update);
router.delete('/tasks/:taskId', remove);

module.exports = router;
