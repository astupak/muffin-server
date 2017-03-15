const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const User = require('../../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }
      
      return done(null, user);
    });
  }
));
