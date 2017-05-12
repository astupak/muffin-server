const mongoose = require('mongoose');
const Release = require('./release');
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Release',
  }],
  
  backlog: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],
  
}, {
  timestamps: true
});

projectSchema.pre('remove',async function(next){
  const dependants = ['releases', 'backlog'];
  
  for (let dependant of dependants) {
    if (this[dependant].length !== 0 ) {
      let Model;

      if (dependant === 'releases') {
        Model = Release;
      } else {
        Model = Story;
      }

      let elems = await Model.find({
        _id: {
          $in: this[dependant]
        }
      });
      
      let promises = releases.map((el)=> {
        return el.remove();
      });

      await Promise.all(promises);
    }
  }
  
  next();
});

projectSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Project', projectSchema);
