const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');
const Story = require('./story');

const sprintSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  description: {
    type:       String,
    trim:       true,
  },

  backlog: [{
    type: Number,
    ref: 'Story',
  }],

}, {
  timestamps: true
});

sprintSchema.statics.changeableFields = ['name', 'description'];

sprintSchema.plugin(autoIncrement.plugin, {
    model: 'Sprint',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Sprint', sprintSchema);
