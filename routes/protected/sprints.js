const Router = require('koa-router');
const {
  addSprint: addSprintToRelease,
  removeSprint: removeSprintFromRelease,
  getSprints,
} = require('../modules/release');
const {
  create,
  read,
  update,
  remove,
} = require('../modules/sprint');

const router = new Router();

router.post('/sprints', create, addSprintToRelease);
router.get('/sprints', getSprints);

router.get('/sprints/:sprintId', read);
router.patch('/sprints/:sprintId', update);
router.delete('/sprints/:sprintId', remove, removeSprintFromRelease);

module.exports = router;
