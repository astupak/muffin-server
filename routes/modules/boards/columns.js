const Column = require('../../../models/column');
const pick = require('lodash/pick');

module.exports.create = async function(name) {
  let column = new Column({
    name
  });
  
  let savedColumn = await column.save();
  
  return savedColumn;
};

module.exports.getPopulated = async function(id) {
  const column = await Column.findById(id).populate('cards');

  return column;
};

module.exports.get = async function(id) {
  const column = await Column.findById(id);

  return column;
};

module.exports.getMany = async function(ids) {
  const columns = await Column.find({
    _id: {
      $in: ids
    }
  });

  return columns;
};

module.exports.removeCard = async function(columnsIds, card) {
  const columns = await Column.update({
    _id: {
      $in: columnsIds
    }
  }, {
    $pull: { cardsList: { $in: [].concat(card) } }
  }, {
    multi: true
  });



  return columns;
}


module.exports.remove = async function(id) {
  const column = await Column.findById(id);

  await column.remove();

  return column;
};