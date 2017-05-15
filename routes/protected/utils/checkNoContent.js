module.exports = async function(ctx, next) {
    if (ctx.body === null || ctx.body === undefined) {
      ctx.throw(404);
    }
    
    await next();
};
