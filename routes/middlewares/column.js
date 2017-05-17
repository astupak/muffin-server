const Boards = require('../modules/board/board');
const Columns = require('../modules/board/column');

module.exports.create = async function (ctx, next) {
  const column = await Columns.create(ctx.request.body.name);
  
  let board = await Boards.get(ctx.params.boardId);

  board.columns.add(column._id);

  await board.save();

  ctx.status = 200;
  ctx.body = column;

  return next();
}

module.exports.getColumn = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  console.log(board);
  
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

module.exports.move = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  let {from, to, card} = ctx.request.body;
  let [toFlag, cardFlag] = [
    board.columnsList.indexOf(to) !== -1,
    board.cardsList.indexOf(card) !== -1,
  ];
  let fromFlag;

  if (from) {
    fromFlag = board.columnsList.indexOf(from) !== -1
  } 

  if ((from && !fromFlag) || (!toFlag || !cardFlag)) {
    ctx.throw(400)
  } else {
    let promises = [];
    let {columnsList: columns} = await board.columns.list();

    if (from) {
      let fromColumn = columns.find((el) => el._id === from);

      fromColumn.cards.remove(card);

      promises.push(fromColumn.save());
    } else {
      let fromColumn = columns.find((el) => el.cardsList.indexOf(card) !== -1);

      fromColumn.cards.remove(card);

      promises.push(fromColumn.save());
    }

    let toColumn = columns.find((el) => el._id === to);

    toColumn.cards.add(card);
    promises.push(toColumn.save());

    await Promise.all(promises);

    ctx.status = 200;
    ctx.body = columns;

  }

  return next();
}
