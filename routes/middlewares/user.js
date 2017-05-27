const Users = require('../modules/users');

module.exports.create = async function(ctx, next) {
  const {email, displayName, password} = ctx.request.body;
  const user = await Users.create(email, displayName, password);

  ctx.status = 201;
  ctx.body = user;

  return next();
}