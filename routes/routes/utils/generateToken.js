const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (ctx, next) => {
  let { user } = ctx.passport;

  const token = jwt.sign(user.id, config.jwt.secret);
  const formattedToken = `JWT ${token}`;

  ctx.status = 200;
  ctx.body = {
    user: user.toObject(),
    formattedToken,
  };
}
