const Router = require('koa-router');
const {
  read,
  update,
  addMember,
  removeMember,
} = require('./company');

const router = new Router();

router.get('/', read);
router.patch('/', update);

router.post('/members', addMember);
router.delete('/members', removeMember);



module.exports = router;
