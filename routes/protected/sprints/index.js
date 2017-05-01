const Router = require('koa-router');
const {
  create,
  read,
  update,
  list,
} = require('./sprint');

const router = new Router();

router.post('/sprints', create);
router.get('/sprints', list);

router.get('/sprints/:sprintId', read);
router.patch('/sprints/:sprintId', update);


module.exports = router;
