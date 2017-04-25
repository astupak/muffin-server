const Router = require('koa-router');
const { JWTAuth, checkPermissions } = require('./protected/utils');
const { create: createUser } = require('./unprotected/user');
const { login, generateToken } = require('./unprotected/utils/login');

const {
  create: createCompany,
  read: readCompany,
  addMember,
} = require('./protected/company');

const {
  create: createProject,
} = require('./protected/project');


const router = new Router();

router.post('/user', createUser);
router.post('/login', login, generateToken);

router.post('/company', JWTAuth, createCompany);

const permissionRouter = new Router();

permissionRouter.get('/', readCompany);
permissionRouter.post('/member', addMember);

permissionRouter.post('/project', createProject);



router.use('/company/:companyName', JWTAuth, checkPermissions, permissionRouter.routes());

module.exports = router.routes();
