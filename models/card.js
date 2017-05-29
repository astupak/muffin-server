const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');
const without = require('lodash/without');

const cardSchema = new mongoose.Schema({
  info: {
    type:       String,
    trim:       true,
  },

  assignedTo: [{
    type: Number,
    ref: 'User',
  }],
  
}, {
  timestamps: true
});

cardSchema.statics.changeableFields = ['info'];

cardSchema.plugin(autoIncrement.plugin, {
    model: 'Card',
    field: '_id',
    startAt: 1,
});

cardSchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}

cardSchema.methods.assignees = {
  add(userId) {
    if (this.assignedTo.indexOf(userId) === -1) {
      this.assignedTo = this.assignedTo.concat(userId);
    }

    return this.assignees;
  },
  remove(usersIds) {
    this.assignedTo = without(this.assignedTo, ...[].concat(usersIds));

    return this.assignees;
  },
}

module.exports = mongoose.model('Card', cardSchema);
