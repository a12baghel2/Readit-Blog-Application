// Imports
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User')

module.exports = (passport) => {
    // Defining Local strategy for verification
    passport.use(
        new LocalStrategy({usernameField: "email"}, (email,password, done) => {
            User.findOne({
                email: email,
            }).then((user) => {
                if (!user) {
                    return done(null, false, {message : "That email is not registered"});
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message : "password is incorrect"});
                    }
                });
            });
        })
    );

    passport.serializeUser((user,done) => {
        done(null,user.id);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};


/*module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};*/