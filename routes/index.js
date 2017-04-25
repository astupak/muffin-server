const Router = require('koa-router');
const companiesRouter = require('./protected/companies');
const projectsRouter = require('./protected/projects');
const releasesRouter = require('./protected/releases');
const { JWTAuth, checkPermissions } = require('./protected/utils');
const { create: createUser } = require('./unprotected/user');
const { login, generateToken } = require('./unprotected/utils/login');
const {
  create: createCompany,
} = require('./protected/companies/company');



const router = new Router();

router.post('/user', createUser);
router.post('/login', login, generateToken);

router.post('/companies', JWTAuth, createCompany);


projectsRouter.use('/projects/:projectId', releasesRouter.routes());

companiesRouter.use(projectsRouter.routes());

router.use('/companies/:companyName', JWTAuth, checkPermissions, companiesRouter.routes());

module.exports = router.routes();
