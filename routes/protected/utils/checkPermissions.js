const Company = require('../../../models/company');

module.exports = async function(ctx, next) {
  const { user } = ctx.passport;
  const company = await Company.findById(ctx.params.companyId);
  
  ctx.state = {
    allowed: {
      projects: company.projectsList
    },
    elements: {
      company: company
    }
  };

  if (company && company.membersList.indexOf(user._id) !== -1) {
    return next();
  }
}
