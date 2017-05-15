const Board = require('../../models/board');
const Row = require('./row');
const pick = require('lodash/pick');
const without = require('lodash/without');

module.exports.create = async function(ctx, next) {
  let board = new Board({
    name: ctx.request.body.name,
  });
  
  let savedBoard = await board.save();
  
  ctx.status = 201;
  ctx.body = savedBoard.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const board = await Board.findById(ctx.params.boardId);

  ctx.status = 200;
  ctx.body = board;

  return next();
};

module.exports.update = async function(ctx, next) {
  let board = await Board.findById(ctx.params.boardId);
  const changes = pick(ctx.request.body, Board.changeableFields);

  board = Object.assign(board, changes);

  await board.save();

  ctx.status = 200;
  ctx.body = board;

  return next();
};

module.exports.remove = async function(ctx, next) {
  const board = await Board.findById(ctx.params.boardId);

  if (board) {
    await board.remove();

    ctx.status = 200;
    ctx.body = board;

    return next();
  } else {
    ctx.throw(404);
  }
  
};

module.exports.assignSprint = async function(ctx, next) {
  let board = await Board.findById(ctx.params.boardId);
  
  board.sprint = ctx.body.sprint;
  board.rows = ctx.body.rows;

  ctx.status = 200;
  ctx.body = board;

  return next();
};