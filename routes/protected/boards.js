const Router = require('koa-router');
const {
  addBoard: addToProject,
  removeBoard: removeFromProject,
  getBoards,
} = require('../modules/project');
const {
  read: getSprint
} = require('../modules/sprint');
const {
  create: createRows
} = require('../modules/row');
const {
  create,
  read,
  update,
  remove,
  assignSprint
} = require('../modules/board');

const router = new Router();

router.post('/boards',create, addToProject);
router.get('/boards', getBoards);

router.get('/boards/:boardId', read);
router.patch('/boards/:boardId', update);
router.delete('/boards/:boardId', remove, removeFromProject);
router.put('/boards/:boardId/sprint', getSprint, createRows, assignSprint );

module.exports = router;
