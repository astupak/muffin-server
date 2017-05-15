const without = require('lodash/without');
const pick = require('lodash/pick');
const Company = require('../../models/company');
const User = require('../../models/user');

module.exports.create = async function(ctx, next) {
  let company = new Company({
    name: ctx.request.body.name,
  });
  
  company.members.push(ctx.passport.user._id);

  let savedCompany = await company.save();
  
  ctx.status = 201;
  ctx.body = savedCompany.toObject();

  return next();
};

module.exports.read = async function(ctx, next) {
  const company = await Company.findById(ctx.params.companyId);

  ctx.status = 200;
  ctx.body = company;

  return next();
};

module.exports.update = async function(ctx, next) {
  const changes = pick(ctx.request.body, Company.changeableFields);

  if (changes.name !== undefined) {
    await rename(ctx);
  }

  return next();
};

module.exports.remove = async function(ctx, next) {
  const company = await Company.findById(ctx.params.companyId);
  
  await company.remove();

  ctx.status = 200;
  ctx.body = company;

  return next();
};

module.exports.addProject = async function(ctx, next) {
  const company = await Company.findById(ctx.params.companyId);

  company.projects.push(ctx.body._id);

  await company.save();

  return next();
};

module.exports.removeProject = async function(ctx, next) {
  const company = await Company.findById(ctx.params.companyId);

  company.projects = without(company.projects, ctx.body._id);

  await company.save();

  return next();
};

module.exports.getProjects = async function(ctx, next) {
  const { projects } = await Company.findById(ctx.params.companyId).populate('projects');

  ctx.status = 200;
  ctx.body = projects;

  return next();
};

module.exports.addMember = async function(ctx, next) {
  const [user, company] = await Promise.all([
    User.findById(ctx.request.body.id),
    Company.findById(ctx.params.companyId)
  ]);
  
  if (user) {
    if (company.members.indexOf(user._id) === -1) {
      company.members.push(user._id);
      
      await company.save();
    }

    ctx.status = 200;
    ctx.body = company;
  } else {
    ctx.throw(404, 'User not found');
  }

  return next();
};

module.exports.removeMember = async function(ctx, next) {
  const [user, company] = await Promise.all([
    User.findById(ctx.request.body.id),
    Company.findById(ctx.params.companyId)
  ]);

  if (user && company.members.indexOf(user._id) !== -1 && company.members.length !== 0) {
    company.members = without(company.members, user._id);
  } else {
    ctx.throw(501, 'Last member of company');
  }
  
  let savedCompany = await company.save();

  ctx.status = 200;
  ctx.body = savedCompany;

  return next();
};

async function rename(ctx) {
  const newName = ctx.request.body.name.toLowerCase();

  let company = await Company.findById(ctx.params.companyId);

  company.name = newName;

  await company.save();

  ctx.status = 200;
  ctx.body = company;
}

