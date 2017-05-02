const Router = require('koa-router');
const {
  create,
  read,
  list,
  update,
  remove,
} = require('./story');

const router = new Router();

router.post('/stories', create);
router.get('/stories', list);

router.get('/stories/:storyId', read);
router.patch('/stories/:storyId', update);
router.delete('/stories/:storyId', remove);

module.exports = router;
