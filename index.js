const Koa = require('koa');
const app = new Koa();

const config = require('config');


require('./libs/mongoose');
const routes = require('./routes');
const middlewares = require('./middlewares');

app.use(middlewares);
app.use(routes);

app.listen(process.env.PORT || 3000);
