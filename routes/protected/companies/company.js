const Company = require('../../../models/company');
const User = require('../../../models/user');

module.exports.create = async function(ctx, next) {
  let company = new Company({
    name: ctx.request.body.name,
  });
  
  company.members.push(ctx.passport.user.displayName);

  let savedCompany = await company.save();
  
  ctx.passport.user.companies.push(company.name);
  await ctx.passport.user.save();
  
  ctx.status = 201;
  ctx.body = savedCompany.toObject();
};

module.exports.read = async function(ctx, next) {
  const company = await Company.findOne({name : ctx.params.companyName});

  ctx.status = 200;
  ctx.body = company;
};

module.exports.addMember = async function(ctx, next) {
  const [user, company] = await Promise.all([
    User.findOne({ displayName: ctx.request.body.name }),
    Company.findOne({ name : ctx.params.companyName })
  ]);
  
  if (user) {
    company.members.push(user.displayName);
    user.companies.push(company.name);
    
    await Promise.all([
      company.save(),
      user.save(),
    ]);

    ctx.status = 200;
    ctx.body = company;
  } else {
    ctx.throw(404, 'User not found');
  }
};
