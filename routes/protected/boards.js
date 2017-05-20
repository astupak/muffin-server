const Router = require('koa-router');
const {
  create,
  read,
  update,
  remove,
  setSprint,
} = require('../middlewares/board');

const router = new Router();

router.post('/boards', create);

router.get('/boards/:boardId', read);
router.delete('/boards/:boardId', remove);
router.patch('/boards/:boardId', update);

router.put('/boards/:boardId/sprint', setSprint);


module.exports = router;
