const pick = require('lodash/pick');
const Boards = require('../modules/board/board');
const Rows = require('../modules/board/row');
const Cards = require('../modules/board/card');

module.exports.create = async function (ctx, next) {
  const card = await Cards.create(ctx.request.body.info);
  const board = await Boards.get(ctx.params.boardId);
  let row = null;

  if (board.rowsList.indexOf(ctx.params.rowId) !== -1) {
    row = await Rows.get(ctx.params.rowId);
  } else {
    ctx.throw(404);
  }

  row.cards.add(card.id);
  board.cards.add(card.id);

  await Promise.all([
    row.save(),
    board.save(),
  ]);

  ctx.status = 200;
  ctx.body = card;

  return next();
}

module.exports.getCard = async function (ctx, next) {
  const row = await Rows.get(ctx.params.rowId);
  
  if (row.cardsList.indexOf(ctx.params.cardId) !== -1) {
    const card = await Cards.get(ctx.params.cardId);
    
    ctx.status = 200;
    ctx.body = card;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.getCards = async function (ctx, next) {
  const row = await Rows.get(ctx.params.rowId);
  const {cardsList: cards} = await row.cards.list();
  
  ctx.status = 200;
  ctx.body = cards;

  return next();
}

module.exports.update = async function (ctx, next) {
  const row = await Rows.get(ctx.params.rowId);
  
  if (row.cardsList.indexOf(ctx.params.cardId) !== -1) {
    const card = await Cards.get(ctx.params.cardId);

    card.update(pick(ctx.request.body, card.model('Card').changeableFields));

    await card.save();
    
    ctx.status = 200;
    ctx.body = card;
  } else {
    ctx.throw(404);
  }
  
  return next();
}

module.exports.remove = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);
  const card = await Cards.remove(ctx.params.cardId);
  let row = await Rows.get(ctx.params.rowId);

  row.cards.remove(row._id);

  await Promise.all([
    row.save(),
    board.save(),
  ]);  

  ctx.status = 200;
  ctx.body = card;

  return next();
}