const Router = require('koa-router');
const {
  read,
  update,
  remove,
  addMember,
  removeMember,
  getProjects,
  getMembers,
} = require('../middlewares/company');

const router = new Router();

router.get('/', read);
router.patch('/', update);
router.delete('/', remove);

router.put('/members', addMember);
router.get('/members', getMembers);
router.delete('/members/:userId', removeMember);

router.get('/projects', getProjects)

module.exports = router;
