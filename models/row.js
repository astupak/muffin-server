const autoIncrement = require('mongoose-auto-increment');
const without = require('lodash/without');
const mongoose = require('mongoose');
const Card = require('./card');

const rowSchema = new mongoose.Schema({
  story: {
    type: Number,
    ref: 'Story',
  },

  cardsList: [{
    type: Number,
    ref: 'Card',
  }],
  
}, {
  timestamps: true
});

rowSchema.plugin(autoIncrement.plugin, {
    model: 'Row',
    field: '_id',
    startAt: 1,
});

rowSchema.pre('remove',async function(next){
  await Card.remove({
    _id: {
      $in: this.cardsList
    }
  })
  
  next();
});

rowSchema.methods.cards = {
  add(cardId) {
    if (this.cardsList.indexOf(cardId) === -1) {    
      this.cardsList = this.cardsList.concat(cardId);
    }

    return this.cards;
  },

  remove(cardsIds) {
    this.cardsList = without(this.cardsList, ...[].concat(cardsIds));

    return this.cards;
  },

  clear() {
    this.cardsList = [];

    return this.cards;
  },

  list() {
    return this.populate('cardsList').execPopulate();
  }
}

module.exports = mongoose.model('Row', rowSchema);
