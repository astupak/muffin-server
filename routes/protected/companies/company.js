const without = require('lodash/without');
const pick = require('lodash/pick');
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

module.exports.update = async function(ctx, next) {
  const changes = pick(ctx.request.body, Company.changeableFields);

  if (changes.name !== undefined) {
    await rename(ctx, next);
  }
};

module.exports.remove = async function(ctx, next) {
  const company = await Company.findOne({name : ctx.params.companyName});
  
  await User.update({
    displayName: {
      $in: company.members
    }
  }, {
    $pull: {
      'companies': company.name
    }
  }, {
    multi: true
  });

  await company.remove();

  ctx.status = 200;
  ctx.body = company;
};

module.exports.addMember = async function(ctx, next) {
  const [user, company] = await Promise.all([
    User.findOne({ displayName: ctx.request.body.name }),
    Company.findOne({ name : ctx.params.companyName })
  ]);
  
  if (user) {
    
    if (!company.members.includes(user.displayName)) {
      company.members.push(user.displayName);
      user.companies.push(company.name);
      
      await Promise.all([
        company.save(),
        user.save(),
      ]);
    }

    ctx.status = 200;
    ctx.body = company;
  } else {
    ctx.throw(404, 'User not found');
  }
};

module.exports.removeMember = async function(ctx, next) {
  let [user, company] = await Promise.all([
    User.findOne({ displayName: ctx.request.body.name }),
    Company.findOne({ name : ctx.params.companyName })
  ]);

  if (user && company && company.members.includes(user.displayName)) {
    company.members = without(company.members, user.displayName);

    if (company.members.length === 0) {
      ctx.throw(501, 'Last member of company');
    } else {
      user.companies = without(user.companies, company.name);
    }
  }
  
  let savedCompany = await company.save();
  await user.save();

  ctx.status = 200;
  ctx.body = savedCompany;
};

async function rename(ctx, next) {
  const previousName = ctx.params.companyName.toLowerCase();
  const newName = ctx.request.body.name.toLowerCase();

  let company = await Company.findOne({ name : previousName });

  company.name = newName;

  await company.save();

  await User.update({
    companies: previousName
  }, {
    $set: {
      'companies.$': newName
    }
  }, {
    multi: true
  });

  ctx.status = 200;
  ctx.body = company;
}

