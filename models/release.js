const mongoose = require('mongoose');
const Sprint = require('./sprint');

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

  sprints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
  }],
  
}, {
  timestamps: true
});

releaseSchema.pre('remove',async function(next){
  if(this.sprints.length !== 0 ) {
    let sprints = await Sprint.find({
      _id: {
        $in: this.sprints
      }
    });
    
    let promises = sprints.map((el)=> {
      return el.remove();
    });

    await Promise.all(promises);
  }
  
  next();
});

releaseSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Release', releaseSchema);
