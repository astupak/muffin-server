const Board = require('../../../models/board');

module.exports.create = async function(props) {
  let board = new Board(props);
  
  let savedBoard = await board.save();

  return savedBoard;
};

module.exports.getPopulated = async function(id) {
  const board = await Board.findById(id).populate({
    path: 'rowsList',
    populate: {
      path: 'cardsList'
    }
  }).populate('columnsList');

  return board;
};

module.exports.get = async function(id) {
  const board = await Board.findById(id);

  return board;
};


module.exports.remove = async function(id) {
  const board = await Board.findById(id);

  await board.remove();

  return board;
};