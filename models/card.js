const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  info: {
    type:       String,
    trim:       true,
  },

  assignedTo: [{
    type: Number,
    ref: 'User',
  }],
  
}, {
  timestamps: true
});

cardSchema.statics.changeableFields = ['info'];

cardSchema.plugin(autoIncrement.plugin, {
    model: 'Card',
    field: '_id',
    startAt: 1,
});

cardSchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}

module.exports = mongoose.model('Card', cardSchema);
