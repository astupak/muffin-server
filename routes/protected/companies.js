const Router = require('koa-router');
const {
  read,
  update,
  remove,
  addMember,
  removeMember,
} = require('../modules/company');

const router = new Router();

router.get('/', read);
router.patch('/', update);
router.delete('/', remove);

router.post('/members', addMember);
router.delete('/members', removeMember);

module.exports = router;
