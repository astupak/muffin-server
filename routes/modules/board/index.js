const Sprint = require('../sprint');
const Board = require('./board');
const Row = require('./row');

module.exports.create = Board.create;
module.exports.read = Board.read;
module.exports.update = Board.update;
module.exports.remove = Board.remove;

module.exports.assignSprint = async function(ctx, next) {
  const sprint = await Sprint.findById(ctx.request.body.id);
  let board = await Board.findById(ctx.params.boardId);

  if (!sprint) {
    ctx.throw(404, 'Sprint not found');
  }

  if (board.sprint) {
    //board.rows.remove();
  }

  ctx.sprint = sprint;

  board.sprint = sprint._id;

  return next();
}


