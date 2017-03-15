const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   'Company name required',
    unique:     'Company name is already in use',
    lowercase:  true,
    trim:       true,
  },

  members: [{
    type: String,
    ref: 'User',
  }],
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
