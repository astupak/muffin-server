const mongoose = require('mongoose');
const Story = require('./story');

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

  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],

}, {
  timestamps: true
});

sprintSchema.pre('remove',async function(next){
  if(this.stories.length !== 0 ) {
    let stories = await Story.find({
      _id: {
        $in: this.stories
      }
    });
    
    let promises = stories.map((el)=> {
      return el.remove();
    });

    await Promise.all(promises);
  }
  
  next();
});

sprintSchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Sprint', sprintSchema);
