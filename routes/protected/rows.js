const Router = require('koa-router');
const {
  getRow,
  getRows,
} = require('../middlewares/row');

const router = new Router();

router.get('/rows', getRows);
router.get('/rows/:rowId', getRow);

module.exports = router;