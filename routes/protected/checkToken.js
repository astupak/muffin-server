const passport = require('koa-passport');

module.exports.checkToken = async (ctx, next) => passport.authenticate('jwt', { session: false })(ctx, next);