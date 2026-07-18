const express = require('express');
const articleRouter = require('./articles');
const authRoute = require('./auth');
const profileRoute = require('./profile');

module.exports = (app) => {
    // Routes middleware
    app.use('/articles', articleRouter);
    app.use('/user', authRoute);
    app.use('/profile', profileRoute);
};
