const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  move,
  isAllowed,
  setState,
} = require('../../middlewares/board/column');

const router = new Router();

router.post('/columns', create);
router.patch('/columns', update);

router.use('/columns/:columnId', isAllowed, setState);

router.get('/columns/:columnId', read);
router.delete('/columns/:columnId', remove);
router.patch('/columns/:columnId/moveCard', move);


module.exports = router;
