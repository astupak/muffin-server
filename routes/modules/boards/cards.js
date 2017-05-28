const Card = require('../../../models/card');

module.exports.create = async function(info) {
  let card = new Card({
    info,
  });
  
  let savedCard = await card.save();
  
  return savedCard;
};

module.exports.get = async function(id) {
  let card = await Card.findById(id);
  
  return card;
};

module.exports.remove = async function(id) {
  const card = await Card.findById(id);

  await card.remove();

  return card;
};