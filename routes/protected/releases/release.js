const Release = require('../../../models/release');
const Project = require('../../../models/project');
const pick = require('lodash/pick');

module.exports.create = async function(ctx, next) {
  const project = await Project.findById(ctx.params.projectId);
  
  let release = new Release({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
  });
  
  let savedRelease = await release.save();

  project.releases.push(release._id);

  await project.save();
  
  ctx.status = 201;
  ctx.body = savedRelease.toObject();
};

module.exports.read = async function(ctx, next) {
  const release = await Release.findById(ctx.params.releaseId);

  ctx.status = 200;
  ctx.body = release;
};

module.exports.update = async function(ctx, next) {
  let release = await Release.findById(ctx.params.releaseId);
  const changes = pick(ctx.request.body, Release.changeableFields);

  release = Object.assign(release, changes);

  await release.save();

  ctx.status = 200;
  ctx.body = release;
};

module.exports.list = async function(ctx, next) {
  const { releases } = await Project.findById(ctx.params.projectId).populate('releases');

  ctx.status = 200;
  ctx.body = releases;
};

