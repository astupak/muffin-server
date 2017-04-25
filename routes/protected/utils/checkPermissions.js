const Company = require('../../../models/company');

module.exports = async function(ctx, next) {
  const { user } = ctx.passport;

  if (user.companies.includes(ctx.params.companyName)) {
    return next();
  }
}
