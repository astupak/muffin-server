const pick = require('lodash/pick');
const Boards = require('../modules/board/board');
const Rows = require('../modules/board/row');
const Projects = require('../modules/newProjects');
const Sprints = require('../modules/newSprints');

module.exports.create = async function (ctx, next) {
  const board = await Boards.create({
    name: ctx.request.body.name
  });
  
  let project = await Projects.get(ctx.params.projectId);

  project.boards.add(board.id);

  await project.save();

  ctx.status = 200;
  ctx.body = board;

  return next();
}

module.exports.read = async function (ctx, next) {
  const board = await Boards.getPopulated(ctx.params.boardId);
  
  ctx.status = 200;
  ctx.body = board;

  return next();
}

module.exports.update = async function (ctx, next) {
  const board = await Boards.get(ctx.params.boardId);

  board.update(pick(ctx.request.body, board.model('Board').changeableFields));
  
  await board.save();
  
  ctx.status = 200;
  ctx.body = board;

  return next();
}

module.exports.remove = async function (ctx, next) {
  const board = await Boards.remove(ctx.params.boardId);
  let project = await Projects.get(ctx.params.projectId);

  project.boards.remove(board._id);

  await project.save();
  
  ctx.status = 200;
  ctx.body = board;

  return next();
}

module.exports.setSprint = async function(ctx, next) {
  const [board, sprint] = await Promise.all([
    Boards.get(ctx.params.boardId),
    Sprints.get(ctx.request.body.id),
  ]);
  const rows = await Rows.createMany(sprint.backlog);

  let promises = [board.save()];

  if (board.rowsList.length) {
    board.rows.clear();
    promises.push(Rows.remove(board.rowsList));
  }

  board.setSprint(sprint._id);
  board.rows.add(rows);

  let [savedBoard,,] = await Promise.all(promises);

  ctx.satus = 200;
  ctx.body = savedBoard;

  return next();
}

