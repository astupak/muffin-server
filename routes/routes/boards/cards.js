const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  check,
  assign,
  unassign,
  isAllowed,
  setState,
} = require('../../middlewares/board/card');

const router = new Router();

router.post('/cards', create);

router.use('/cards/:cardId', isAllowed, setState);

router.get('/cards/:cardId', read);
router.patch('/cards/:cardId', update);
router.delete('/cards/:cardId', remove);

router.put('/cards/:cardId/assignedTo', assign);
router.delete('/cards/:cardId/assignedTo/:assigneeId', unassign);

module.exports = router;
