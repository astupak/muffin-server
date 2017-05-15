const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');
const Card = require('./card');

const rowSchema = new mongoose.Schema({
  story: {
    type: Number,
    ref: 'Story',
  },

  cards: [{
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
      $in: this.cards
    }
  })
  
  next();
});
module.exports = mongoose.model('Row', rowSchema);
