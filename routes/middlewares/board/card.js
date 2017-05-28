const pick = require('lodash/pick');
const Boards = require('../../modules/boards/boards');
const Rows = require('../../modules/boards/rows');
const Cards = require('../../modules/boards/cards');

module.exports.create = async function (ctx, next) {
  const card = await Cards.create(ctx.request.body.info);
  const {board} = ctx.state.elements;
  let row = null;

  if (board.rowsList.indexOf(ctx.params.rowId) !== -1) {
    const {row} = ctx.state.elements;
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

module.exports.read = async function (ctx, next) {
  const row = await Rows.get(ctx.params.rowId);
  
  if (row.cardsList.indexOf(ctx.params.cardId) !== -1) {
    const {card} = ctx.state.elements;
    
    ctx.status = 200;
    ctx.body = card;
  } else {
    ctx.throw(404);
  }
  
  return next();
}


module.exports.update = async function (ctx, next) {
  const row = await Rows.get(ctx.params.rowId);
  
  if (row.cardsList.indexOf(ctx.params.cardId) !== -1) {
    const {card} = ctx.state.elements;

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
  const {board, row} = ctx.state.elements;
  const card = await Cards.remove(ctx.params.cardId);

  row.cards.remove(row._id);
  board.cards.remove();

  await Promise.all([
    row.save(),
    board.save(),
  ]);  

  ctx.status = 200;
  ctx.body = card;

  return next();
}

module.exports.isAllowed = async function(ctx, next) {
  const allowedCards = ctx.state.allowed.cards;
  const {cardId} = ctx.params;

  if (allowedCards.indexOf(cardId) === -1) {
    ctx.throw(404);
  } else {
    console.log('card allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {cardId} = ctx.params;
  let {allowed} = ctx.state;

  const card = await Cards.get(cardId);

  ctx.state.elements.card = card;
  return next();
}
