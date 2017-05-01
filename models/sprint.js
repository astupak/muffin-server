const mongoose = require('mongoose');

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

  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],

}, {
  timestamps: true
});

module.exports = mongoose.model('Sprint', sprintSchema);
