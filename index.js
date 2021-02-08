// Imports
const  express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/articles');
const articleRouter = require('./routes/articles');

// Initialise express
const app = express();

//Connect to the database
// connection code goes here

// set template view engine
app.set('view engine', 'ejs');

//Routes middleware
app.use('/articles', articleRouter);

//Routes
app.get('/', (req,res) => {
    res.render('articles/index');
});

app.get('/:name', (req,res) => {
    res.send(`hello ${req.params.name}`);
});

app.listen(5000, () => {
    console.log("server started pooling 5000....");
});