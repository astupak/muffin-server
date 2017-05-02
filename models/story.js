const mongoose = require('mongoose');
const Task = require('./task');

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

  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],

  estimation: {
    type: Number,
    min: 1,
    max: 5,
  },
  
}, {
  timestamps: true
});

storySchema.pre('remove',async function(next){
  if(this.tasks.length !== 0 ) {
    let tasks = await Task.find({
      _id: {
        $in: this.tasks
      }
    });
    
    let promises = tasks.map((el)=> {
      return el.remove();
    });

    await Promise.all(promises);
  }
  
  next();
});

storySchema.statics.changeableFields = ['name', 'description'];

module.exports = mongoose.model('Story', storySchema);
