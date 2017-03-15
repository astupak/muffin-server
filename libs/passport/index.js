const passport = require('koa-passport');
const User = require('../../models/user');

require('./JwtStrategy');

require('./localStrategy');

module.exports = passport;
