const Boards = require('../modules/board/board');
const Columns = require('../modules/board/column');

module.exports.create = async function (ctx, next) {
  const column = await Columns.create(ctx.request.body.name);
  
  let board = await Boards.get(ctx.params.boardId);

  board.columns.add(column.id);

  await board.save();

  ctx.status = 200;
  ctx.body = column;

  return next();
}

module.exports.getColumn = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  
  if (board.columnsList.indexOf(ctx.params.columnId) !== -1) {
    const column = await Columns.getPopulated(ctx.params.columnId);
    
    ctx.status = 200;
    ctx.body = column;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.getColumns = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  const {columnsList: columns} = await board.columns.list();
  
  ctx.status = 200;
  ctx.body = columns;

  return next();
}

module.exports.remove = async function (ctx, next) {
  const column = await Columns.remove(ctx.params.columnId);
  let board = await Boards.get(ctx.params.boardId);

  board.columns.remove(board._id);

  await board.save();
  
  ctx.status = 200;
  ctx.body = column;

  return next();
}

// module.exports.move = async function (ctx, next) {
//   const board = await Boards.get(ctx.params.boardId);
//   const {columnsList: columns} = await board.columns.list();
  
//   ctx.status = 200;
//   ctx.body = columns;

//   return next();
// }
