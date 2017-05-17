const autoIncrement = require('mongoose-auto-increment');
const without = require('lodash/without');
const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  cards: [{
    type: Number,
    ref: 'Card',
  }],
  
}, {
  timestamps: true
});

columnSchema.statics.changeableFields = ['name'];

columnSchema.plugin(autoIncrement.plugin, {
    model: 'Column',
    field: '_id',
    startAt: 1,
});


module.exports = mongoose.model('Column', columnSchema);
