const pick = require('lodash/pick');
const Boards = require('../../modules/boards/boards');
const Rows = require('../../modules/boards/rows');
const Columns = require('../../modules/boards/columns');
const Projects = require('../../modules/projects');
const Sprints = require('../../modules/sprints');

module.exports.create = async function (ctx, next) {
  const board = await Boards.create(ctx.request.body.name);
  const {project} = ctx.state.elements;

  project.boards.add(board.id);

  await project.save();

  ctx.status = 201;
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
  const {board} = ctx.state.elements;

  board.update(pick(ctx.request.body, board.model('Board').changeableFields));
  
  await board.save();
  
  ctx.status = 200;
  ctx.body = board;

  return next();
}

module.exports.remove = async function (ctx, next) {
  const board = await Boards.remove(ctx.params.boardId);
  const {project} = ctx.state.elements;

  project.boards.remove(board._id);

  await project.save();
  
  ctx.status = 200;
  ctx.body = board;

  return next();
}

module.exports.assignSprint = async function(ctx, next) {
  const {board, project} = ctx.state.elements;
  const sprint = await Sprints.get(ctx.request.body.sprint);

  if (sprint && sprint.storiesList.length && project.sprintsList.indexOf(sprint._id) !== -1) {

    if (board.rowsList.length) {
      await Rows.remove(board.rowsList);
      await Columns.removeCard(ctx.state.allowed.columns, board.cardsList);
      board.rows.clear();
    }

    const rows = await Rows.createMany(sprint.storiesList);

    board.setSprint(sprint._id);
    board.rows.add(rows);
    board.cards.clear();

    const savedBoard = await board.save();

    ctx.satus = 200;
    ctx.body = savedBoard;
  } else {
    ctx.throw(400);
  }

  return next();
}

module.exports.getRows = async function(ctx, next) {
  const {board} = ctx.state.elements;
  const {rowsList: rows} = await board.rows.list();

  ctx.status = 200;
  ctx.body = rows;

  return next();
}

module.exports.getColumns = async function(ctx, next) {
  const {board} = ctx.state.elements;
  const {columnsList: columns} = await board.columns.list();

  ctx.status = 200;
  ctx.body = columns;

  return next();
}

module.exports.getCards = async function(ctx, next) {
  const {board} = ctx.state.elements;
  console.log(2, board);
  const {cardsList: cards} = await board.cards.list();
  console.log(2, board);

  ctx.status = 200;
  ctx.body = cards;

  return next();
}

module.exports.isAllowed = async function(ctx, next) {
  const allowedBoards = ctx.state.allowed.boards;
  const {boardId} = ctx.params;

  if (allowedBoards.indexOf(boardId) === -1) {
    ctx.throw(404);
  } else {
    console.log('board allowed');
    return next();
  }
}

module.exports.setState = async function (ctx, next) {
  const {boardId} = ctx.params;
  let {allowed} = ctx.state;

  const board = await Boards.get(boardId);

  const {
    rowsList: rows,
    columnsList: columns,
    cardsList: cards,
  } = board;

  ctx.state.allowed = Object.assign(allowed, {
    rows,
    columns,
    cards,
  });

  ctx.state.elements.board = board;

  return next();
}



