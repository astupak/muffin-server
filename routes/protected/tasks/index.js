const Router = require('koa-router');
const {
  create: createTask,
  read: readTask,
  list: listTasks,
} = require('./task');

const router = new Router();

router.post('/tasks', createTask);
router.get('/tasks', listTasks);

router.get('/tasks/:taskId', readTask);

module.exports = router;
