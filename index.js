// Imports
const  express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/articles');
const User = require('./models/User.js');
require('dotenv/config');
const articleRouter = require('./routes/articles');
const authRoute = require('./routes/auth');
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
app.use(express.json());

// Method overriding
app.use(methodOverride("_method"));

//Routes middleware
app.use('/articles', articleRouter);
app.use('/user', authRoute);

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