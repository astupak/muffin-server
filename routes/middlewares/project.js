const Projects = require('../modules/newProjects');

module.exports.read = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);

  ctx.status = 200;
  ctx.body = project;

  return next();
}

module.exports.getBoards = async function (ctx, next) {
  const project = await Projects.get(ctx.params.projectId);
  const { boardsList: boards } =  await project.boards.list();
  
  ctx.status = 200;
  ctx.body = boards;

  return next();
}