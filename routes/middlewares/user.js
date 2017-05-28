const pick = require('lodash/pick');
const Users = require('../modules/users');

module.exports.create = async function(ctx, next) {
  const {email, displayName, password} = ctx.request.body;
  const user = await Users.create(email, displayName, password);

  ctx.status = 201;
  ctx.body = user;

  return next();
}

module.exports.read = async function(ctx, next) {

  ctx.status = 200;
  ctx.body = ctx.state.user;

  return next();
}

module.exports.update = async function(ctx, next) {
  const {user} = ctx.state;

  user.update(pick(ctx.request.body, user.model('User').changeableFields));

  await user.save();

  ctx.status = 200;
  ctx.body = user;

  return next();
}

module.exports.remove = async function(ctx, next) {
  const {user} = ctx.state;

  await user.remove();

  ctx.status = 200;
  ctx.body = user;

  return next();
}

module.exports.isAllowed = async function(ctx, next) {
  const {user} = ctx.passport;

  if (user._id === ctx.params.userId) {
    console.log('user allowed');
    return next();
  } else {
    ctx.throw(404);
  }

  return next();
}

module.exports.setState = async function(ctx, next) {
  const {user} = ctx.passport;
  
  ctx.state.user = user.toObject();

  return next();
}