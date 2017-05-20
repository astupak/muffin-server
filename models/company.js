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

  projects: [{
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
  add(usersIds) {
    this.membersList = this.membersList.concat(usersIds);

    return this.members;
  },
  remove(usersIds) {
    this.membersList = without(this.membersList, ...[].concat(usersIds));

    return this.rows;
  }
}

module.exports = mongoose.model('Company', companySchema);
