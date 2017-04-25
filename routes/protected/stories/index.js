const Router = require('koa-router');
const {
  create: createStory,
  read: readStory,
  list: listStories,
} = require('./story');

const router = new Router();

router.post('/stories', createStory);
router.get('/stories', listStories);

router.get('/stories/:storyId', readStory);

module.exports = router;
