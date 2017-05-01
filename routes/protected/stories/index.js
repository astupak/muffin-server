const Router = require('koa-router');
const {
  create,
  read,
  update,
  list,
} = require('./story');

const router = new Router();

router.post('/stories', create);
router.get('/stories', list);

router.get('/stories/:storyId', read);
router.patch('/stories/:storyId', update);

module.exports = router;
