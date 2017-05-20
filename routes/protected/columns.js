const Router = require('koa-router');
const {
  create: createColumn,
  getColumns,
  getColumn,
  remove: removeColumn,
  move
} = require('../middlewares/column');

const router = new Router();

router.get('/columns', getColumns);
router.post('/columns', createColumn);
router.patch('/columns', move);
router.get('/columns/:columnId', getColumn);
router.delete('/columns/:columnId', removeColumn);

module.exports = router;
