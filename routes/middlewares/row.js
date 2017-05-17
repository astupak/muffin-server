const Boards = require('../modules/board/board');
const Rows = require('../modules/board/row');

module.exports.getRow = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  
  if (board.rowsList.indexOf(ctx.params.rowId) !== -1) {
    const row = await Rows.getPopulated(ctx.params.rowId);
    
    ctx.status = 200;
    ctx.body = row;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.getRows = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  const {rowsList: rows} = await board.rows.list();
  
  ctx.status = 200;
  ctx.body = rows;

  return next();
}
