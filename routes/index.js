const Router = require('koa-router');
const companiesRouter = require('./routes/companies');
const projectsRouter = require('./routes/projects');
const releasesRouter = require('./routes/releases');
const sprintsRouter = require('./routes/sprints');
const storiesRouter = require('./routes/stories');
const boardsRouter = require('./routes/boards');
const usersRouter = require('./routes/users');
const {
  login,
  generateToken,
  JWTAuth,
  checkPermissions
} = require('./routes/utils');

const {
  create: createCompany,
} = require('./middlewares/company');
const {
  create: createUser,
} = require('./middlewares/user');

const router = new Router();

router.use(usersRouter.routes());

router.post('/login', login, generateToken);
router.post('/user', createUser);
router.post('/companies', JWTAuth, createCompany);

projectsRouter.use('/projects/:projectId', storiesRouter.routes());
projectsRouter.use('/projects/:projectId', releasesRouter.routes());
projectsRouter.use('/projects/:projectId', sprintsRouter.routes());
projectsRouter.use('/projects/:projectId', boardsRouter.routes());

companiesRouter.use(projectsRouter.routes());

router.use('/companies/:companyId', JWTAuth, checkPermissions, companiesRouter.routes());
router.use('/user/:userId', JWTAuth, usersRouter.routes());

module.exports = router.routes();
