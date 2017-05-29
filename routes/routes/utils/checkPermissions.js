const Company = require('../../../models/company');

module.exports = async function(ctx, next) {
  const { user } = ctx.passport;
  const company = await Company.findById(ctx.params.companyId);

  if (company && company.membersList.indexOf(user._id) !== -1) {
     ctx.state = {
      allowed: {
        projects: company.projectsList,
        members: company.membersList,
      },
      elements: {
        company: company
      }
    };
    return next();
  }
}
