const autoIncrement = require('mongoose-auto-increment');
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

  releases: [{
    type: Number,
    ref: 'Release',
  }],

  sprints: [{
    type: Number,
    ref: 'Sprint',
  }],
  
  backlog: [{
    type: Number,
    ref: 'Story',
  }],

  boards: [{
    type: Number,
    ref: 'Board',
  }],
  
}, {
  timestamps: true
});

projectSchema.pre('remove',async function(next){
  const dependants = ['releases', 'sprints', 'backlog', 'boards'];
  
  for (let dependant of dependants) {
    if (this[dependant].length !== 0 ) {
      let Model;
      switch (dependant) {
        case 'releases':
          Model = Release;
          break;
        case 'sprints':
          Model = Sprint;
          break;
        case 'backlog':
          Model = Story;
          break;
        case 'boards':
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

projectSchema.statics.changeableFields = ['name', 'description'];

projectSchema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Project', projectSchema);
