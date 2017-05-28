const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  getRows,
  getColumns,
  getCards,
  assignSprint,
  isAllowed,
  setState,
} = require('../../middlewares/board/board');

const router = new Router();

router.post('/boards', create);

router.use('/boards/:boardId', isAllowed, setState);

router.get('/boards/:boardId', read);
router.delete('/boards/:boardId', remove);
router.patch('/boards/:boardId', update);

router.post('/boards/:boardId/assignSprint', assignSprint);

router.get('/boards/:boardId/rows', getRows);
router.get('/boards/:boardId/columns', getColumns);
router.get('/boards/:boardId/cards', getCards);



module.exports = router;
