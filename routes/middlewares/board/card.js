const pick = require('lodash/pick');
const Boards = require('../../modules/boards/boards');
const Rows = require('../../modules/boards/rows');
const Cards = require('../../modules/boards/cards');

module.exports.create = async function (ctx, next) {
  const card = await Cards.create(ctx.request.body.info);
  const {board, row} = ctx.state.elements;

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
  const card = await Cards.remove(parseInt(ctx.params.cardId));

  row.cards.remove(row._id);
  board.cards.remove(card._id);

  await Promise.all([
    row.save(),
    board.save(),
  ]);  

  ctx.status = 200;
  ctx.body = card;

  return next();
}

module.exports.assign = async function (ctx, next) {
  const {card} = ctx.state.elements;
  const allowedUsers = ctx.state.allowed.members;
  const userId = ctx.request.body.user;

  if (allowedUsers.indexOf(userId) !== -1) {
    card.assignees.add(userId);

    await card.save();

    ctx.body = card;
    ctx.status = 200;
  } else {
    ctx.throw(400);
  }
  
  return next();
}

module.exports.unassign = async function (ctx, next) {
  const {card} = ctx.state.elements;
  const userId = parseInt(ctx.params.assigneeId);

  card.assignees.remove(userId);

  await card.save();

  ctx.body = card;
  ctx.status = 200;
  
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
