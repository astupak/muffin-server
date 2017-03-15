module.exports.get = async function(ctx, next) {
    ctx.status = 200;
    ctx.logout();
}