var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//landing page route
router.get("/", function(req, res) {
    res.render("landing");
});

//register form route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

//register post route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to SkiCamp, " + user.username);
            res.redirect("/skigrounds");
        });
    });
});

//login route
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

//login post route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/skigrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/skigrounds");
});


module.exports = router;