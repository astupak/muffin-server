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

module.exports.remove = async function(id) {
  const column = await Column.findById(id);

  await column.remove();

  return column;
};