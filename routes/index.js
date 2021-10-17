const usersRouter = require('./users');
const authRouter = require('./auth');
const postsRouter = require('./posts');
const conversationRouter = require('./conversations');
const messageRouter = require('./messages');

function route(app) {
    app.use('/api/users', usersRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/posts', postsRouter);
    app.use('/api/conversations', conversationRouter);
    app.use('/api/messages', messageRouter);
}

module.exports = route;
