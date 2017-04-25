const Router = require('koa-router');
const {
  create: createSprint,
  read: readSprint,
  list: listSprints,
} = require('./sprint');

const router = new Router();

router.post('/sprints', createSprint);
router.get('/sprints', listSprints);

router.get('/sprints/:sprintId', readSprint);

module.exports = router;
