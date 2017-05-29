const autoIncrement = require('mongoose-auto-increment');
const without = require('lodash/without');
const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  cardsList: [{
    type: Number,
    ref: 'Card',
  }],
  
}, {
  timestamps: true
});

columnSchema.statics.changeableFields = ['name'];

columnSchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}

columnSchema.methods.cards = {
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

  list() {
    return this.populate('cardsList').execPopulate();
  }

}

columnSchema.plugin(autoIncrement.plugin, {
    model: 'Column',
    field: '_id',
    startAt: 1,
});


module.exports = mongoose.model('Column', columnSchema);
