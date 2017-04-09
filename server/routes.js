const userApi = require('./api/user');
const postApi = require('./api/post');
const authApi = require('./api/auth');
const cateApi = require('./api/category');
const commentApi = require('./api/comment');

module.exports = (app) => {
    app.use('/api/user', userApi);
    app.use('/api/post', postApi);
    app.use('/api/category', cateApi);
    app.use('/api/comment', commentApi);
    app.use('/api/auth', authApi);
}