const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  isAllowed,
  setState,
} = require('../middlewares/story');
const router = new Router();

router.post('/backlog', create);

router.use('/backlog/:storyId', isAllowed, setState);

router.get('/backlog/:storyId', read);

router.patch('/backlog/:storyId', update);
router.delete('/backlog/:storyId', remove);

module.exports = router;
