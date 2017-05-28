const Router = require('koa-router');
const { JWTAuth, checkPermissions } = require('./protected/utils');
const { login, generateToken } = require('./unprotected/utils');
const companiesRouter = require('./protected/companies');
const projectsRouter = require('./protected/projects');
const releasesRouter = require('./protected/releases');
const sprintsRouter = require('./protected/sprints');
const storiesRouter = require('./protected/stories');
const boardsRouter = require('./protected/boards');
const usersRouter = require('./unprotected/users');

const {
  create: createCompany,
} = require('./middlewares/company');

const router = new Router();

router.use(usersRouter.routes());

router.post('/login', login, generateToken);

router.post('/companies', JWTAuth, createCompany);

projectsRouter.use('/projects/:projectId', storiesRouter.routes());
projectsRouter.use('/projects/:projectId', releasesRouter.routes());
projectsRouter.use('/projects/:projectId', sprintsRouter.routes());
projectsRouter.use('/projects/:projectId', boardsRouter.routes());

companiesRouter.use(projectsRouter.routes());

router.use('/companies/:companyId', JWTAuth, checkPermissions, companiesRouter.routes());

module.exports = router.routes();
