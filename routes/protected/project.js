const Project = require('../../models/project');
// const User = require('../../models/user');

module.exports.create = async function(ctx, next) {
  const { user } = ctx.passport;
  
  let project = new Project({
    name: ctx.request.body.name,
    description: ctx.request.body.description,
    company: ctx.params.companyName
  });
  

  let savedProject = await project.save();
    
  ctx.status = 201;
  ctx.body = savedProject.toObject();
};
