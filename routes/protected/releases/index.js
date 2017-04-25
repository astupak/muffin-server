const Router = require('koa-router');
const {
  create: createRelease,
  read: readRelease,
  list: listReleases,
} = require('./release');

const router = new Router();

router.post('/releases', createRelease);
router.get('/releases', listReleases);

router.get('/releases/:releaseId', readRelease);

module.exports = router;
