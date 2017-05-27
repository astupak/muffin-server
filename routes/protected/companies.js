const Router = require('koa-router');
const {
  read,
  update,
  remove,
  addMember,
  removeMember,
  getProjects,
} = require('../middlewares/company');

const router = new Router();

router.get('/', read);
router.patch('/', update);
router.delete('/', remove);

router.put('/members', addMember);
router.delete('/members', removeMember);

router.get('/projects', getProjects)

module.exports = router;
