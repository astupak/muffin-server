const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  description: {
    type:       String,
    trim:       true,
  },

  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],

  company: {
    type: String,
    ref: 'Company',
  }, 

  estimation: {
    type: Number,
    min: 1,
    max: 5,
  },
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
