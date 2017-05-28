const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  check,
  isAllowed,
  setState,
} = require('../../middlewares/board/card');

const router = new Router();

router.post('/cards', create);

router.use('/cards/:cardId', isAllowed, setState);

router.get('/cards/:cardId', read);
router.patch('/cards/:cardId', update);
router.delete('/cards/:cardId', remove);

module.exports = router;
