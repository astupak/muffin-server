const pick = require('lodash/pick');
const Companies = require('../modules/companies');
const Users = require('../modules/users');

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

module.exports.addMember = async function(ctx, next) {
  const [user, company] = await Promise.all([
    Users.get(ctx.request.body.user),
    Companies.get(ctx.params.companyId),
  ]);

  if (user) {
    if (company.membersList.indexOf(user._id) === -1) {
      company.members.add(user._id);

      await company.save();
    }

    ctx.status = 200;
    ctx.body = company;
  } else {
    ctx.throw(400);
  }
};

module.exports.removeMember = async function(ctx, next) {
  const company = await Companies.get(ctx.params.companyId);
  const userId = parseInt(ctx.params.userId);

  if (company.membersList.indexOf(userId) !== -1 && company.membersList.length !== 0) {
    company.members.remove(userId);
  } else {
    ctx.throw(501, 'Last member of company');
  }
  
  let savedCompany = await company.save();

  ctx.status = 200;
  ctx.body = savedCompany;

  return next();

};

module.exports.getProjects = async function(ctx, next) {
  const company = await Companies.get(ctx.params.companyId);
  const {projectsList: projects} = await company.projects.list();

  ctx.status = 200;
  ctx.body = projects;

  return next();
}

module.exports.getMembers = async function(ctx, next) {
  const company = await Companies.get(ctx.params.companyId);
  const {membersList: members} = company;

  ctx.status = 200;
  ctx.body = members;

  return next();
}