const Router = require('koa-router');
const {
  addRelease: addReleaseToProject,
  removeRelease: removeReleaseFromProject,
  getReleases,
} = require('../modules/project');
const {
  create,
  read,
  update,
  remove,
} = require('../modules/release');

const router = new Router();

router.post('/releases',create, addReleaseToProject);
router.get('/releases', getReleases);

router.get('/releases/:releaseId', read);
router.patch('/releases/:releaseId', update);
router.delete('/releases/:releaseId', remove, removeReleaseFromProject);

module.exports = router;
