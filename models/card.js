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

cardSchema.statics.changeableFields = ['name', 'info'];

cardSchema.plugin(autoIncrement.plugin, {
    model: 'Card',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Card', cardSchema);
