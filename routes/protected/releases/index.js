const Router = require('koa-router');
const {
  create,
  read,
  update,
  list,
} = require('./release');

const router = new Router();

router.post('/releases',create);
router.get('/releases', list);

router.get('/releases/:releaseId', read);
router.patch('/releases/:releaseId', update);


module.exports = router;
