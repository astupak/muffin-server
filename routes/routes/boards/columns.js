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
router.put('/columns/:columnId/cards', move);

router.get('/columns/:columnId', read);
router.patch('/columns/:columnId', update);
router.delete('/columns/:columnId', remove);



module.exports = router;
