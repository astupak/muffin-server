const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  setSprint,
} = require('../middlewares/board');
const {
  create: createColumn,
  getColumns,
  getColumn,
  remove: removeColumn
} = require('../middlewares/column');
const {
  getRow,
  getRows,
} = require('../middlewares/row');
const {
  create: createCard,
  getCards,
  getCard,
  update: updateCard,
  remove: removeCard,
} = require('../middlewares/card');


const router = new Router();

router.post('/boards', create);

router.get('/boards/:boardId', read);
router.delete('/boards/:boardId', remove);
router.patch('/boards/:boardId', update);

router.put('/boards/:boardId/sprint', setSprint);

router.get('/boards/:boardId/rows', getRows);
router.get('/boards/:boardId/rows/:rowId', getRow);

router.post('/boards/:boardId/columns', createColumn);
router.get('/boards/:boardId/columns', getColumns);
router.get('/boards/:boardId/columns/:columnId', getColumn);

router.post('/boards/:boardId/rows/:rowId/cards', createCard);
router.get('/boards/:boardId/rows/:rowId/cards', getCards);
router.get('/boards/:boardId/rows/:rowId/cards/:cardId', getCard);
router.patch('/boards/:boardId/rows/:rowId/cards/:cardId', updateCard);
router.delete('/boards/:boardId/rows/:rowId/cards/:cardId', removeCard);

module.exports = router;
