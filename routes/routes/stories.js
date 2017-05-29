const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  estimate,
  prioritize,
  isAllowed,
  setState,
} = require('../middlewares/story');
const router = new Router();

router.post('/backlog', create);

router.use('/backlog/:storyId', isAllowed, setState);

router.get('/backlog/:storyId', read);

router.patch('/backlog/:storyId', update);
router.delete('/backlog/:storyId', remove);

router.post('/backlog/:storyId/estimate', estimate);
router.post('/backlog/:storyId/prioritize', prioritize);

module.exports = router;
