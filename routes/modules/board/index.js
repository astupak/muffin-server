const SprintModel = require('../../../models/sprint');
const BoardModel = require('../../../models/board');
const BoardModule = require('./board');
const ColumnModule = require('./column');
const RowModule = require('./row');

module.exports.create = BoardModule.create;
module.exports.get = BoardModule.get;
module.exports.update = BoardModule.update;
module.exports.remove = BoardModule.remove;

// module.exports.column = ColumnModule;

// module.exports.assignSprint = async function(ctx, next) {
//   const sprint = await SprintModel.findById(ctx.request.body.id);
//   let board = await BoardModel.findById(ctx.params.boardId);

//   board.sprint = sprint._id;

//   if (board.rows.length) {
//     await RowModule.remove(board.rows);
//   }

//   board.rows = await RowModule.create(sprint.backlog);

//   await board.save();

//   ctx.status = 200;
//   ctx.body = board;

//   return next();
// }


