const Router = require('koa-router');
const {
  create: createCard,
  getCards,
  getCard,
  update: updateCard,
  remove: removeCard,
} = require('../middlewares/card');

const router = new Router();

router.post('/cards', createCard);
router.get('/cards', getCards);
router.get('/cards/:cardId', getCard);
router.patch('/cards/:cardId', updateCard);
router.delete('/cards/:cardId', removeCard);

module.exports = router;
