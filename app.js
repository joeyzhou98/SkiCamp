require("dotenv").config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

//requiring routes
var commentRoutes = require("./routes/comments");
var skigroundRoutes = require("./routes/skigrounds");
var indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost/ski_camp");
mongoose.connect("mongodb://Joey:qpwo1029@ds253840.mlab.com:53840/ski_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//configure passport
app.use(require("express-session")({
    secret: "McDonalds is delicious",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/skigrounds/:id/comments", commentRoutes);
app.use("/skigrounds", skigroundRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("SkiCamp server has started");
});