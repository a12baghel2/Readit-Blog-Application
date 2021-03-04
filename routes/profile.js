// Imports
const express = require('express');
const Article = require('./../models/articles');
const User = require('./../models/User');
const { ensureAuthenticated, forwadAuthenticated } = require('../isAuth');

const route = express.Router();

route.get('/:name', ensureAuthenticated, async (req,res) => {
    const articles = await Article.find({createdBy : req.user.username}).sort({createdAt: 'desc'});
    res.render('user/profile', { articles: articles , name: req.params.name});
});

module.exports = route;