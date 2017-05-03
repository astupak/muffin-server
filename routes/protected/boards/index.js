const Router = require('koa-router');
const {
  create,
} = require('./board');

const router = new Router();

router.post('/boards',create);



module.exports = router;
