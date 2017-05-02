const Router = require('koa-router');
const {
  create,
  read,
  list,
  update,
  remove,
} = require('./sprint');

const router = new Router();

router.post('/sprints', create);
router.get('/sprints', list);

router.get('/sprints/:sprintId', read);
router.patch('/sprints/:sprintId', update);
router.delete('/sprints/:sprintId', remove);


module.exports = router;
