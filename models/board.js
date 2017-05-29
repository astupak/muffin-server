const autoIncrement = require('mongoose-auto-increment');
const without = require('lodash/without');
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
    default: 0,
  },

  cardsList: [{
    type: Number,
    ref: 'Card',
  }],

  rowsList: [{
    type: Number,
    ref: 'Row',
  }],

  columnsList: [{
    type: Number,
    ref: 'Column',
  }],
  
}, {
  timestamps: true
});

boardSchema.statics.changeableFields = ['name'];

boardSchema.pre('remove',async function(next){
  const dependants = ['rowsList', 'columnsList'];
  
  for (let dependant of dependants) {
    if (this[dependant].length !== 0 ) {
      let Model;
      switch (dependant) {
        case 'rowsList':
          Model = Row;
          break;
        case 'columnsList':
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

boardSchema.methods.setSprint = function(sprintId) {
  this.sprint = sprintId;

  return this;
}

boardSchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}


boardSchema.methods.rows = {
  add(rowId) {
    if (this.rowsList.indexOf(rowId) === -1) {
      this.rowsList = this.rowsList.concat(rowId);
    }

    return this.rows;
  },

  remove(rowsIds) {
    this.rowsList = without(this.rowsList, ...[].concat(rowsIds));

    return this.rows;
  },

  clear() {
    this.rowsList = [];

    return this.rows;
  },

  list() {
    return this.populate('rowsList').execPopulate();
  }
}

boardSchema.methods.cards = {
  add(cardId) {
    if (this.cardsList.indexOf(cardId) === -1) {
      this.cardsList = this.cardsList.concat(cardId);
    }

    return this.cards;
  },

  remove(cardsIds) {
    this.cardsList = without(this.cardsList, ...[].concat(cardsIds));

    return this.cards;
  },

  clear() {
    this.cardsList = [];

    return this.cards;
  },

  list() {
    return this.populate('cardsList').execPopulate();
  }
}

boardSchema.methods.columns = {
  add(columnId) {
    if (this.columnsList.indexOf(columnId) === -1) {
      this.columnsList = this.columnsList.concat(columnId);
    }

    return this.columns;
  },

  remove(columnsIds) {
    this.columnsList = without(this.columnsList, ...[].concat(columnsIds));

    return this.columns;
  },

  clear() {
    this.columnsList = [];

    return this.columns;
  },

  list() {
    return this.populate('columnsList').execPopulate();
  }
}

boardSchema.plugin(autoIncrement.plugin, {
    model: 'Board',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('Board', boardSchema);
