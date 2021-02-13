// Imports
const express = require('express');
const Article = require('./../models/articles');

const route = express.Router();

// Route to add new article
route.get('/new', (req,res) => {
    res.render('articles/new', { article: new Article() })
});

// Route to edit specific article
route.get('/edit/:id', async (req, res) =>{
    const article = await Article.findById(req.params.id);
    res.render('articles/edit' , {article: article});
});

// Route to get the full article
route.get('/:slug', async (req,res) => {
    const article = await Article.findOne({ slug: req.params.slug});
    if(article == null) res.redirect('/');
    res.render('articles/show', {article: article })
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
route.delete('/:id', async (req,res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

// Function to save article in database 
function saveArticleAndRedirect(path){
    return async (req,res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
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