const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('config');
const pick = require('lodash/pick');

const userSchema = new mongoose.Schema({
  email: {
    type:       String,
    required:   'Email required',
    unique:     'Email is already in use',
    lowercase:  true,
    trim:       true,

    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },

      msg: 'Email is not valid'
    }],
  },

  displayName: {
    type: String,
    required: 'Name required',
    unique: 'Такое имя уже существует',
    trim: true,
  },

  passwordHash:  {
    type: String,
    required: true
  },

  salt:          {
    required: true,
    type: String
  },

  
}, {
  timestamps: true
});

userSchema.statics.publicFields = ['_id', 'email', 'displayName'];
userSchema.statics.changeableFields = ['email', 'displayName'];

userSchema.virtual('password')
  .set(function(password) {
    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен состоять не менее чем из 5 символов');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length, 'sha1');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  }); 

userSchema.methods.checkPassword = function(password) {
  if (!password) return false;
  if (!this.passwordHash) return false;

  return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length, 'sha1') == this.passwordHash;
}

userSchema.methods.update = function(props) {
  for (let prop in props) {
    this[prop] = props[prop];
  }

  return this;
}

userSchema.plugin(schema => {  
  schema.options.toObject = {};

  schema.options.toObject.transform = (doc, ret) => pick(ret, userSchema.statics.publicFields);
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: '_id',
    startAt: 1,
});

module.exports = mongoose.model('User', userSchema);
