const usersRouter = require('./users');
const authRouter = require('./auth');
const postsRouter = require('./posts');

function route(app) {
    app.use('/api/users', usersRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/posts', postsRouter);
}

module.exports = route;
