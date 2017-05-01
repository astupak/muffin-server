const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  description: {
    type:       String,
    trim:       true,
  },

  releases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Release',
  }],
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
