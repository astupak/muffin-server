const passport = require('koa-passport');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports.login = passport.authenticate('local', { session: false });

module.exports.generateToken = async (ctx, next) => {
  let { user } = ctx.passport;

  const token = jwt.sign(user.id, config.jwt.secret);
  const formattedToken = `JWT ${token}`;

  ctx.status = 200;
  ctx.body = {
    user: user.toObject(),
    formattedToken,
  };
}
