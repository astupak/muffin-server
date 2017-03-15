const Router = require('koa-router');
const { JWTAuth, checkPermissions } = require('./protected/utils');
const { create: createUser } = require('./unprotected/user');
const { login, generateToken } = require('./unprotected/utils/login');
const {
  create: createCompany,
  read: readCompany,
  addMember,
} = require('./protected/company');

const router = new Router();

//unprotected routes
router.post('/user', createUser);
router.post('/login', login, generateToken);

//protected routes

//Company

router.post('/company', JWTAuth, createCompany);

router.get('/company/:name', JWTAuth, checkPermissions, readCompany);
router.post('/company/:name/member', JWTAuth, checkPermissions, addMember);

//

module.exports = router.routes();