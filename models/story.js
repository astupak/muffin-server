const autoIncrement = require('mongoose-auto-increment');
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

  estimation: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL'],
  },

  priority: {
    type: Number,
    min: 0,
    max: 10,
  },
  
}, {
  timestamps: true
});

storySchema.statics.changeableFields = ['name', 'description'];

storySchema.methods.setEstimation = function(est) {
  this.estimation = est;

  return this;
}

storySchema.methods.setPriority = function(priority) {
  this.priority = priority;

  return this;
}

storySchema.plugin(autoIncrement.plugin, {
    model: 'Story',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Story', storySchema);
