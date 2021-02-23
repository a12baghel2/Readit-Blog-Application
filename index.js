// Imports
const  express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require("method-override");

// Local Imports
const Article = require('./models/articles');
const User = require('./models/User.js');
require('dotenv/config');
const articleRouter = require('./routes/articles');
const authRoute = require('./routes/auth');

// Initialise express
const app = express();

// Passport config
require('./passport-config')(passport);

// Creating the sessions
app.use(session({
    secret: process.env.DB_CONNECTION,
    resave: true,
    saveUninitialized: true,
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    next();
});

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

// Simple test route
/*app.get('/:name', (req,res) => {
    res.send(`hello ${req.params.name}`);
});*/

app.listen(5000, () => {
    console.log("server started pooling 5000....");
});