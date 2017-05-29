const Row = require('../../../models/row');


module.exports.create = async function(id) {
  let row = await Row.create({
    story: id
  });
  
  return row;
};

module.exports.getPopulated = async function(id) {
  let row = await Row.findById(id).populate('story cards');
  
  return row;
};

module.exports.get = async function(id) {
  let row = await Row.findById(id);
  
  return row;
};

module.exports.createMany = async function(ids) {
  let rows = ids.map((story) => {
    return { story };
  });

  console.log(rows, ids);
  rows = await Row.create(rows);
  rows = rows.map((row) => row._id);
  
  return [].concat(rows);
};

module.exports.remove = async function(id) {
  let elems = await Row.find({
    _id: {
      $in: id
    }
  });

  let promises = elems.map((el)=> {
    return el.remove();
  });

  await Promise.all(promises);

  return elems;
};