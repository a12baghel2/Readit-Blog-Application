// Imports
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Vlaidation imports
const { registerValidation, loginValidation } = require('../validation');

// Register route
router.post('/register', async (req,res) => {
    
    // Validation of the data
    const { error } = registerValidation(req.body);
    if( error ) return res.status(400).send(error.details[0].message);

    // Checking if user already exist in the database
    const existUser = await User.findOne({email: req.body.email});
    if(existUser) return res.status(400).send("User already exist");

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating New User 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: HashedPassword,
    });

    // Saving User in the database
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login route
router.get('/login', (req,res) => {
    res.render('articles/login');
})

router.post('/login', async (req,res) => {

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
    res.redirect('/');
});

// Exporting the route
module.exports = router;
