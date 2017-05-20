const Router = require('koa-router');
const companiesRouter = require('./protected/companies');
const projectsRouter = require('./protected/projects');
const releasesRouter = require('./protected/releases');
const boardsRouter = require('./protected/boards');
const rowsRouter = require('./protected/rows');
const columnsRouter = require('./protected/columns');
const cardsRouter = require('./protected/cards');

const {
  sprintsRouter,
  releaseSprintRouter
} = require('./protected/sprints');
const {
  projectBacklogRouter,
  releaseBacklogRouter,
  sprintBacklogRouter,
} = require('./protected/backlog');
const { JWTAuth, checkPermissions } = require('./protected/utils');
const { create: createUser } = require('./unprotected/user');
const { login, generateToken } = require('./unprotected/utils/login');
const {
  create: createCompany,
} = require('./modules/company');

const router = new Router();

router.post('/user', createUser);
router.post('/login', login, generateToken);

router.post('/companies', JWTAuth, createCompany);

rowsRouter.use('/rows/:rowId', cardsRouter.routes());

boardsRouter.use('/boards/:boardId', rowsRouter.routes());
boardsRouter.use('/boards/:boardId', columnsRouter.routes());

sprintsRouter.use('/sprints/:sprintId', sprintBacklogRouter.routes());

releasesRouter.use('/releases/:releaseId', releaseBacklogRouter.routes());
releasesRouter.use('/releases/:releaseId', releaseSprintRouter.routes());

projectsRouter.use('/projects/:projectId', boardsRouter.routes());
projectsRouter.use('/projects/:projectId', sprintsRouter.routes());
projectsRouter.use('/projects/:projectId', releasesRouter.routes());
projectsRouter.use('/projects/:projectId', projectBacklogRouter.routes());

companiesRouter.use(projectsRouter.routes());

router.use('/companies/:companyId', JWTAuth, checkPermissions, companiesRouter.routes());

module.exports = router.routes();
