const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('config');

mongoose.Promise = Promise;

mongoose.plugin(beautifyUnique);

mongoose.plugin(schema => {
  if (!schema.options.toObject) {
    schema.options.toObject = {};
  }

  if (schema.options.toObject.transform == undefined) {
    schema.options.toObject.transform = (doc, ret) => { 
      delete ret.__v; 
      // ret._id = String(ret._id.toString());
      return ret; };
  }

});

mongoose.set('debug', true);

mongoose.connect(config.mongoose.uri, config.mongoose.options);
