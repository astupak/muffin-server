module.exports = async function(ctx, next) {
    await next();

    if (ctx.body === null && ctx.status === 204) {
      ctx.throw(404);
    }
};
