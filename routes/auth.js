// Imports
const router = require('express').Router();
const User = require('../models/User');
const Article = require('../models/articles');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { forwardAuthenticated } = require('../isAuth');

// Vlaidation imports
const { registerValidation, loginValidation } = require('../validation');


// Register page route 
router.get('/register', forwardAuthenticated, (req,res) => {
    res.render('user/register',{error: ""});
})

// Register 
router.post('/register', async (req,res) => {
    
    // Validation of the data
    const { error } = registerValidation(req.body);
    if( error ) return res.status(400).render('user/register', {error : error.details[0].message} );

    // Checking if user already exist in the database
    const existUser = await User.findOne({email: req.body.email});
    if(existUser) return res.status(400).render('user/register',{error : "User already exist" });

    // Checking if the username exist or not in the database
    const existUsername = await User.findOne({username : req.body.username});
    if (existUsername) return res.status(400).render('user/register', {error : "Username already exist"});

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating New User 
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: HashedPassword,
    });

    // Saving User in the database
    try {
        const savedUser = await user.save();
        res.redirect('/user/login');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login page route
router.get('/login', forwardAuthenticated, (req,res) => {
    res.render('user/login');
})

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});


/*router.post('/login', async (req,res) => {

    // Validation of the data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking user exist or not in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Account doesn't exist");

    // Checking password entered is valid or not
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid Password");

    // Creating a webtoken
    const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.header('auth_token',token).send(token);
});*/

// Logout
router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})

// Exporting the route
module.exports = router;

