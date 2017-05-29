const Boards = require('../../modules/boards/boards');
const Rows = require('../../modules/boards/rows');

module.exports.read = async function (ctx, next) {
  const {board} = ctx.state.elements;
  
  if (board.rowsList.indexOf(ctx.params.rowId) !== -1) {
    const row = await Rows.getPopulated(ctx.params.rowId);
    
    ctx.status = 200;
    ctx.body = row;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.getCards = async function (ctx, next) {
  const {row} = ctx.state.elements;
  const {cardsList: cards} = await row.cards.list();
  
  ctx.status = 200;
  ctx.body = cards;

  return next();
}

module.exports.isAllowed = async function(ctx, next) {
  const allowedRows = ctx.state.allowed.rows;
  const {rowId} = ctx.params;

  if (allowedRows.indexOf(rowId) === -1) {
    ctx.throw(404);
  } else {
    console.log('row allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {rowId} = ctx.params;
  let {allowed} = ctx.state;

  const row = await Rows.get(rowId);

  const {
    cardsList: cards,
  } = row;

  ctx.state.allowed = Object.assign(allowed, {
    cards,
  });

  ctx.state.elements.row = row;
  return next();
}



