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

  board.columns.remove(column._id);

  await board.save();
  
  ctx.status = 200;
  ctx.body = column;

  return next();
}

module.exports.move = async function (ctx, next) {
  const {board} = ctx.state.elements;
  const {card} = ctx.request.body;
  const allowedColumns = ctx.state.allowed.columns;
  const allowedCards = ctx.state.allowed.cards;

  if (allowedCards.indexOf(card) !== -1) {
    let columns = await Columns.removeCard(allowedColumns, card);
    let {column} = ctx.state.elements;

    column.cards.add(card);

    await column.save();

    ctx.body = column;
    ctx.status = 200;

  } else {
    ctx.throw(400);
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

  ctx.state.elements.column = column;
  return next();
}



