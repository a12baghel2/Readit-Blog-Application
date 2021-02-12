// Imports
const  express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/articles');
require('dotenv/config');
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');

// Initialise express
const app = express();

//Connect to the database
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}, () => {
    console.log("Connected to the database.....");
});

// set template view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

// Method overriding
app.use(methodOverride("_method"));

//Routes middleware
app.use('/articles', articleRouter);

//Routes
app.get('/', async (req,res) => {
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', { articles: articles });
});

app.get('/:name', (req,res) => {
    res.send(`hello ${req.params.name}`);
});

app.listen(5000, () => {
    console.log("server started pooling 5000....");
});