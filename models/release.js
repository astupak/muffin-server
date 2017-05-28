const without = require('lodash/without');
const autoIncrement = require('mongoose-auto-increment');
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

  sprintsList: [{
    type: Number,
    ref: 'Sprint',
  }],

  storiesList: [{
    type: Number,
    ref: 'Story',
  }],
  
}, {
  timestamps: true
});

releaseSchema.statics.changeableFields = ['name', 'description'];

releaseSchema.plugin(autoIncrement.plugin, {
    model: 'Release',
    field: '_id',
    startAt: 1,
});

releaseSchema.methods.backlog = {
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

releaseSchema.methods.sprints = {
  add(sprintId) {
    if (this.sprintsList.indexOf(sprintId) === -1) {
      this.sprintsList = this.sprintsList.concat(sprintId);
    }

    return this.sprints;
  },
  remove(storiesIds) {
    this.sprintsList = without(this.sprintsList, ...[].concat(storiesIds));

    return this.sprints;
  },
  list() {
    return this.populate('sprintsList').execPopulate();
  }
}


module.exports = mongoose.model('Release', releaseSchema);
