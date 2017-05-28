const boardsRouter = require('./boards');
const rowsRouter = require('./rows');
const columnsRouter = require('./columns');
const cardsRouter = require('./cards');

rowsRouter.use('/rows/:rowId', cardsRouter.routes());

boardsRouter.use('/boards/:boardId', rowsRouter.routes());
boardsRouter.use('/boards/:boardId', columnsRouter.routes());

module.exports = boardsRouter;