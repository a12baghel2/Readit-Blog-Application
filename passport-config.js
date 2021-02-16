const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = User.findOne({email : email});
        console.log(`user password ${user.mail} and ${user.password}`);
        if(user == null) {
            return done(null, false, {message: 'No user with that mail'});
        }

        try{
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else{
                return done(null, false, { mesaage: 'Password incorrect'});
            }
        } catch (e){
            return done(e);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, authenticateUser));
    passport.serializeUser((user, done) => done(null,user.id));
    passport.deserializeUser((id,done) => {
        return done(null, getUserById(id));
    });
}

module.exports = initialize;