const Row = require('../../models/row');

module.exports.create = async function(ctx, next) {  
  let rows = ctx.body.backlog.map((story) => {
    return { story };
  });

  rows = await Row.create(rows);

  ctx.status = 200;
  ctx.body = {
    sprint: ctx.body._id,
    rows
  };

  return next();
};
