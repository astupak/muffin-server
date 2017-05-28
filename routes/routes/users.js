const Router = require('koa-router');
const {
  read,
  update,
  remove,
  isAllowed,
  setState,
} = require('../middlewares/user');

const router = new Router();
router.use('/', isAllowed, setState);
router.get('/', read);
router.patch('/', update);
router.delete('/', remove);

module.exports = router;
