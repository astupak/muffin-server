const Router = require('koa-router');
const {
  read,
  getCards,
  isAllowed,
  setState,
} = require('../../middlewares/board/row');

const router = new Router();

router.use('/rows/:rowId', isAllowed, setState);

router.get('/rows/:rowId', read);

router.get('/rows/:rowId/cards', getCards);

module.exports = router;