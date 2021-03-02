// Imports
const express = require('express');
const Article = require('./../models/articles');
const { ensureAuthenticated, forwardAuthenticated } = require('../isAuth');

const route = express.Router();

// Test route for errors
/*route.get("/random", ensureAuthenticated, (req, res) => {
  res.json({
    post: {
      title: "This is a post",
      description: "can't access without login",
    },
  });
});*/

// Route to add new article
route.get('/new', ensureAuthenticated,(req,res) => {
    let name = req.user.name;
    res.render('articles/new', { article: new Article(), name : name })
});

// Route to edit specific article
route.get('/edit/:id', ensureAuthenticated , async (req, res) =>{
    const article = await Article.findById(req.params.id);
    let name = req.user.name;
    res.render('articles/edit' , {article: article, name: name});
});

// Route to get the full article
route.get('/:slug' , async (req,res) => {
    const article = await Article.findOne({ slug: req.params.slug});
    if(article == null) res.redirect('/');
    let name;
    try {
      name = req.user.name;
    } catch (e) {
      name = "Guest";
    }
    res.render('articles/show', {article: article, name : name })
});

// Default route
route.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

// Route to update edited specific article
route.put('/:id' , async (req,res, next) =>{
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

// Route to delete specific post/article
route.delete("/:id", ensureAuthenticated , async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Function to save article in database 
function saveArticleAndRedirect(path){
    return async (req,res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        article.createdBy = req.user.username;
        try{
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch(e){
            console.log(e);
            res.render(`articles/${path}`, { article: article})
        }
    }
}

module.exports = route;