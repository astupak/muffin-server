const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  description: {
    type:       String,
    trim:       true,
  },

  sprints: [{
    type: Schema.Types.ObjectId,
    ref: 'Sprint',
  }],

  company: {
    type: String,
    ref: 'Company',
  }
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Release', releaseSchema);
