const compose = require('koa-compose');
const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'sorted')).sort();

let middlewares = [];

handlers.forEach((handler) => {
  middlewares.push(require('./sorted/' + handler));
});

module.exports = compose(middlewares);