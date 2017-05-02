const mongoose = require('mongoose');
const Release = require('./release');

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
  
}, {
  timestamps: true
});

projectSchema.pre('remove',async function(next){
  if (this.releases.length !== 0 ) {
    let releases = await Release.find({
      _id: {
        $in: this.releases
      }
    });
    
    let promises = releases.map((el)=> {
      return el.remove();
    });

    await Promise.all(promises);
  }
  
  next();
});

projectSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Project', projectSchema);
