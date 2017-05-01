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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
  }],
  
}, {
  timestamps: true
});

releaseSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Release', releaseSchema);
