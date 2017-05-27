const autoIncrement = require('mongoose-auto-increment');
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

  projectsList: [{
    type: Number,
    ref: 'Project',
  }],

  membersList: [{
    type: Number,
    ref: 'User',
  }],
  
}, {
  timestamps: true
});

companySchema.pre('remove',async function(next){
  if (this.projectsList.length !== 0) {
    let projectsList = await Project.find({
      _id: {
        $in: this.projectsList
      }
    });
    
    let promises = projectsList.map((el)=> {
      return el.remove();
    });

    await Promise.all(promises);
  }

  next();
});

companySchema.statics.changeableFields = ['name'];

companySchema.plugin(autoIncrement.plugin, {
    model: 'Company',
    field: '_id',
    startAt: 1,
});

companySchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}

companySchema.methods.members = {
  add(userId) {
    if (this.membersList.indexOf(userId) === -1) {
      this.membersList = this.membersList.concat(userId);
    }

    return this.members;
  },
  remove(usersIds) {
    this.membersList = without(this.membersList, ...[].concat(usersIds));

    return this.members;
  }
}

companySchema.methods.projects = {
  add(projectId) {
    if (this.projectsList.indexOf(projectId) === -1) {
      this.projectsList = this.projectsList.concat(projectId);
    }

    return this.projects;
  },
  remove(projectsIds) {
    this.projectsList = without(this.projectsList, ...[].concat(projectsIds));

    return this.projects;
  },
  list() {
    return this.populate('projectsList').execPopulate();
  }
}


module.exports = mongoose.model('Company', companySchema);
