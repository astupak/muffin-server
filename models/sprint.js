const without = require('lodash/without');
const autoIncrement = require('mongoose-auto-increment');
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

  storiesList: [{
    type: Number,
    ref: 'Story',
  }],

}, {
  timestamps: true
});

sprintSchema.statics.changeableFields = ['name', 'description'];

sprintSchema.plugin(autoIncrement.plugin, {
    model: 'Sprint',
    field: '_id',
    startAt: 1,
});

sprintSchema.methods.backlog = {
  add(storyId) {
    if (this.storiesList.indexOf(storyId) === -1) {
      this.storiesList = this.storiesList.concat(storyId);
    }

    return this.backlog;
  },
  remove(storiesIds) {
    this.storiesList = without(this.storiesList, ...[].concat(storiesIds));

    return this.backlog;
  },
  list() {
    return this.populate('storiesList').execPopulate();
  }
}

module.exports = mongoose.model('Sprint', sprintSchema);
