const pick = require('lodash/pick');
const Companies = require('../modules/company');

module.exports.create = async function(ctx, next) {
  let company = await Companies.create(ctx.request.body.name);
  
  company.members.add(ctx.passport.user._id);

  let savedCompany = await company.save();
  
  ctx.status = 201;
  ctx.body = savedCompany.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const company = await Companies.get(ctx.params.companyId);

  ctx.status = 200;
  ctx.body = company;

  return next();
};

module.exports.update = async function (ctx, next) {
  const company = await Companies.get(ctx.params.companyId);

  company.update(pick(ctx.request.body, company.model('Company').changeableFields));
  
  await company.save();
  
  ctx.status = 200;
  ctx.body = company;

  return next();
};

module.exports.remove = async function(ctx, next) {
  const company = await Companies.remove(ctx.params.companyId);
  
  ctx.status = 200;
  ctx.body = company;

  return next();
};