const User = require('../../models/user');

module.exports.create = async function(ctx, next) {
  let user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
  });
  
  user.password = ctx.request.body.password;

  let savedUser = await user.save();

  ctx.status = 201;
  ctx.body = savedUser.toObject();
}