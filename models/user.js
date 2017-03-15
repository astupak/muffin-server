const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('config');
const pick = require('lodash/pick');


const userSchema = new mongoose.Schema({
  email: {
    type:       String,
    required:   'Укажите email', // true for default message
    unique:     'Такой email уже существует',
    lowercase:  true, // to compare with another email
    trim:       true,
    
    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },

      msg: 'Укажите, пожалуйста, корректный email.'
    }],
  },

  displayName: {
    type: String,
    required: 'Укажите имя',
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
  }
}, {
  timestamps: true // createdAt, updatedAt
});

userSchema.statics.publicFields = ['_id', 'email', 'displayName'];

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

userSchema.plugin(schema => {  
  schema.options.toObject = {};

  schema.options.toObject.transform = (doc, ret) => pick(ret, userSchema.statics.publicFields);

});


module.exports = mongoose.model('User', userSchema);
