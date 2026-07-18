// Imports
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { forwardAuthenticated } = require('../middleware/auth');

// Validation imports
const { registerValidation, loginValidation } = require('../utils/validation');

// Register page route 
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('user/register', { error: "" });
})

// Register 
router.post('/register', async (req, res) => {

    // Validation of the data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).render('user/register', { error: error.details[0].message });

    // Checking if user already exist in the database
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) return res.status(400).render('user/register', { error: "User already exist" });

    // Checking if the username exist or not in the database
    const existUsername = await User.findOne({ username: req.body.username });
    if (existUsername) return res.status(400).render('user/register', { error: "Username already exist" });

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
router.get('/login', forwardAuthenticated, (req, res) => {
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

// Logout
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

// Exporting the route
module.exports = router;
