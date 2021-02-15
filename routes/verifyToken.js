const jwt = require('jsonwebtoken');


module.exports = function (req,res,next) {
    const token = req.header('auth_token');
    console.log(`token is ${token}`);
    if(!token) return res.status(401).redirect('/user/login');

    try {
        const verified = jwt.verify(token,process.env.SECRET_TOKEN);
        console.log("Has logged in....");
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
}