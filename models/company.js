const mongoose = require('mongoose');
const Project = require('./project');


const companySchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   'Company name required',
    unique:     'Company name is already in use',
    lowercase:  true,
    trim:       true,
  },

  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],

  members: [{
    type: String,
    ref: 'User',
  }],
  
}, {
  timestamps: true
});

companySchema.pre('remove',async function(next){
  if (this.projects.length !== 0) {
    let projects = await Project.find({
      _id: {
        $in: this.projects
      }
    });
    
    let promises = projects.map((el)=> {
      return el.remove();
    });

    await Promise.all(promises);
  }

  next();
});


companySchema.statics.changeableFields = ['name'];

module.exports = mongoose.model('Company', companySchema);
