module.exports = {
    // Ensure user is authenticated in order to view the content
    ensureAuthenticated: (req,res,next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Please log in to view");
        res.redirect("/user/login");
    },
    // Redirecting user to the login page if it is not logged-in
    forwardAuthenticated : (req,res,next) => {
        if (!req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }
}
