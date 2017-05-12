const Router = require('koa-router');
const { 
  addProject: addProjectToCompany,
  removeProject: removeProjectFromCompany,
  getProjects
} = require('../modules/company');
const {
  create,
  read,
  update,
  remove,
} = require('../modules/project');

const router = new Router();

router.post('/projects', create, addProjectToCompany);
router.get('/projects', getProjects);

router.get('/projects/:projectId', read);
router.patch('/projects/:projectId', update);
router.delete('/projects/:projectId', remove, removeProjectFromCompany);

module.exports = router;
