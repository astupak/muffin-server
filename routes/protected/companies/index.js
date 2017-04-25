const Router = require('koa-router');
const {
  read: readCompany,
  addMember,
} = require('./company');

const router = new Router();

router.get('/', readCompany);
router.post('/members', addMember);

module.exports = router;
