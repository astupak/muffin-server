const pick = require('lodash/pick');
const Boards = require('../../modules/boards/boards');
const Columns = require('../../modules/boards/columns');

module.exports.create = async function (ctx, next) {
  const column = await Columns.create(ctx.request.body.name);
  
  const {board} = ctx.state.elements;

  board.columns.add(column._id);

  await board.save();

  ctx.status = 200;
  ctx.body = column;

  return next();
}

module.exports.read = async function (ctx, next) {
  const {board} = ctx.state.elements;
  
  if (board.columnsList.indexOf(ctx.params.columnId) !== -1) {
    const column = await Columns.getPopulated(ctx.params.columnId);
    
    ctx.status = 200;
    ctx.body = column;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.update = async function (ctx, next) {
  const {board} = ctx.state.elements;
  
  if (board.columnsList.indexOf(ctx.params.columnId) !== -1) {
    const {column} = ctx.state.elements;

    column.update(pick(ctx.request.body, column.model('Column').changeableFields));

    await column.save();
    
    ctx.status = 200;
    ctx.body = column;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.remove = async function (ctx, next) {
  const column = await Columns.remove(ctx.params.columnId);
  const {board} = ctx.state.elements;

  board.columns.remove(board._id);

  await board.save();
  
  ctx.status = 200;
  ctx.body = column;

  return next();
}

module.exports.move = async function (ctx, next) {
  const {board} = ctx.state.elements;
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

module.exports.isAllowed = async function(ctx, next) {
  const allowedColumns = ctx.state.allowed.columns;
  const {columnId} = ctx.params;

  if (allowedColumns.indexOf(columnId) === -1) {
    ctx.throw(404);
  } else {
    console.log('column allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {columnId} = ctx.params;
  let {allowed} = ctx.state;

  const column = await Columns.get(columnId);

  const {
    cardsList: cards,
  } = column;

  ctx.state.elements.column = column;
  return next();
}



