const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type:       String,
    trim:       true,
  },

  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
  },

  cols: [String],

  populatedSprint: [{
    data: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
    },
    tasks: [{
      data : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
      //todo assign
    }],
    // ToDO estimation
  }]
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Board', boardSchema);
