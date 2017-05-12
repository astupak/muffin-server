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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],

}, {
  timestamps: true
});

sprintSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Sprint', sprintSchema);
