const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  getBacklog,
  addStory,
  removeStory,
} = require('../middlewares/sprint');
const router = new Router();

router.post('/sprints', create);

router.get('/sprints/:sprintId', read);

router.patch('/sprints/:sprintId', update);
router.delete('/sprints/:sprintId', remove);

router.get('/sprints/:sprintId/backlog', getBacklog);
router.put('/sprints/:sprintId/backlog', addStory);

router.delete('/sprints/:sprintId/backlog/:storyId', removeStory);


module.exports = router;
