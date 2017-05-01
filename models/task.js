const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  description: {
    type:       String,
    trim:       true,
  },

  assignedTo: [{
    type: String,
    ref: 'User',
  }],

  company: {
    type: String,
    ref: 'Company',
  }
  
}, {
  timestamps: true
});

taskSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Task', taskSchema);
