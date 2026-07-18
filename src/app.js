const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require("method-override");
const path = require('path');
require('dotenv/config');

// Config imports
const connectDB = require('./config/database');
const passportConfig = require('./config/passport');

// Model imports
const Article = require('./models/Article');

// Routes
const setupRoutes = require('./routes/index');

const app = express();

// Initialize database connection
connectDB();

// Static files
app.use('/static', express.static(path.join(__dirname, '../src/public')));

// Passport config
passportConfig(passport);

// Creating the sessions
app.use(session({
    secret: process.env.DB_CONNECTION || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    next();
});

// Set template view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method overriding
app.use(methodOverride("_method"));

// Setup routes
setupRoutes(app);

// Home route
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    let name;
    try {
        name = req.user.username;
    } catch (e) {
        name = "Guest"
    }
    res.render('articles/index', { articles: articles, name: name });
});

module.exports = app;
