const autoIncrement = require('mongoose-auto-increment');
const Row = require('./row');
const Column = require('./column');
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type:       String,
    required:   true,
    trim:       true,
  },

  sprint: {
    type: Number,
    ref: 'Sprint',
  },

  rows: [{
    type: Number,
    ref: 'Row',
  }],

  columns: [{
    type: Number,
    ref: 'Column',
  }],
  
}, {
  timestamps: true
});

boardSchema.statics.changeableFields = ['name'];

boardSchema.pre('remove',async function(next){
  const dependants = ['rows', 'columns'];
  
  for (let dependant of dependants) {
    if (this[dependant].length !== 0 ) {
      let Model;
      switch (dependant) {
        case 'rows':
          Model = Row;
          break;
        case 'columns':
          Model = Column;
          break;
      }

      let elems = await Model.find({
        _id: {
          $in: this[dependant]
        }
      });
      
      let promises = elems.map((el)=> {
        return el.remove();
      });

      await Promise.all(promises);
    }
  }
  
  next();
});



boardSchema.plugin(autoIncrement.plugin, {
    model: 'Board',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Board', boardSchema);
