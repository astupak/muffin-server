const autoIncrement = require('mongoose-auto-increment');
const without = require('lodash/without');
const mongoose = require('mongoose');
const Release = require('./release');
const Sprint = require('./sprint');
const Board = require('./board');
const Story = require('./story');

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

  releasesList: [{
    type: Number,
    ref: 'Release',
  }],

  sprintsList: [{
    type: Number,
    ref: 'Sprint',
  }],
  
  storiesList: [{
    type: Number,
    ref: 'Story',
  }],

  boardsList: [{
    type: Number,
    ref: 'Board',
  }],
  
}, {
  timestamps: true
});

projectSchema.statics.changeableFields = ['name', 'description'];

projectSchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}

projectSchema.pre('remove',async function(next){
  const dependants = ['releasesList', 'sprintsList', 'storiesList', 'boardsList'];
  
  for (let dependant of dependants) {
    if (this[dependant].length !== 0 ) {
      let Model;
      switch (dependant) {
        case 'releasesList':
          Model = Release;
          break;
        case 'sprintsList':
          Model = Sprint;
          break;
        case 'storiesList':
          Model = Story;
          break;
        case 'boardsList':
          Model = Board;
          break;
      }

      let elems = await Model.find({
        _id: {
          $in: this[dependant]
        }
      });
      
      let promises = elems.map((el)=> {
        return el.remove();
      });

      await Promise.all(promises);
    }
  }
  
  next();
});

projectSchema.methods.backlog = {
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

projectSchema.methods.releases = {
  add(releaseId) {
    if (this.releasesList.indexOf(releaseId) === -1) {
      this.releasesList = this.releasesList.concat(releaseId);
    }

    return this.releases;
  },
  remove(releasesIds) {
    this.releasesList = without(this.releasesList, ...[].concat(releasesIds));

    return this.releases;
  },
  list() {
    return this.populate('releasesList').execPopulate();
  }
}

projectSchema.methods.sprints = {
  add(sprintId) {
    if (this.sprintsList.indexOf(sprintId) === -1) {
      this.sprintsList = this.sprintsList.concat(sprintId);
    }

    return this.sprints;
  },
  remove(sprintsIds) {
    this.sprintsList = without(this.sprintsList, ...[].concat(sprintsIds));

    return this.sprints;
  },
  list() {
    return this.populate('sprintsList').execPopulate();
  }
}

projectSchema.methods.boards = {
  add(boardId) {
    if (this.boardsList.indexOf(boardId) === -1) {
      this.boardsList = this.boardsList.concat(boardId);
    }

    return this.boards;
  },
  remove(boardsIds) {
    this.boardsList = without(this.boardsList, ...[].concat(boardsIds));

    return this.boards;
  },
  list() {
    return this.populate('boardsList').execPopulate();
  }
}

projectSchema.statics.changeableFields = ['name', 'description'];

projectSchema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Project', projectSchema);
