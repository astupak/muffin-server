const Router = require('koa-router');
const { checkToken } = require('./protected/checkToken');
const { register } = require('./unprotected/join');
const { login, generateToken } = require('./unprotected/login');

const router = new Router();

//unprotected routes
router.post('/login', login, generateToken);
router.post('/join', register);

//protected routes
router.get('/frontpage', checkToken, require('./protected/frontpage').get);
// router.get('/logout', checkToken, require('./protected/logout').get);

module.exports = router.routes();