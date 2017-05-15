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
  
}, {
  timestamps: true
});

storySchema.statics.changeableFields = ['name', 'description'];

storySchema.plugin(autoIncrement.plugin, {
    model: 'Story',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Story', storySchema);
