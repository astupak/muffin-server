const Company = require('../../../models/company');

module.exports = async function(ctx, next) {
  const { user } = ctx.passport;
  const company = await Company.findOne({name : ctx.params.companyName});

  if (company && company.members.includes(user.displayName)) {
    return next();
  }
}
