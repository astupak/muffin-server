const config = require('config');
const passport = require('koa-passport');
const JwtStrategy = require('passport-jwt').Strategy;
const JwtExtractor = require('passport-jwt').ExtractJwt;
const User = require('../../models/user');

passport.use(new JwtStrategy({
    jwtFromRequest: JwtExtractor.fromAuthHeader(),
    secretOrKey: config.jwt.secret,
  },
  (JwtPayload, done) => {
   User.findById(JwtPayload, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }
      
      return done(null, user);
    });
  }
));
