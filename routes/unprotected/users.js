const Router = require('koa-router');
const {
  create,
} = require('../middlewares/user');

const router = new Router();

router.post('/user', create);

module.exports = router;
