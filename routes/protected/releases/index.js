const Router = require('koa-router');
const {
  create,
  read,
  list,
  update,
  remove,
} = require('./release');

const router = new Router();

router.post('/releases',create);
router.get('/releases', list);

router.get('/releases/:releaseId', read);
router.patch('/releases/:releaseId', update);
router.delete('/releases/:releaseId', remove);


module.exports = router;
