var express = require("express");
var router = express.Router();
var Skiground = require("../models/skiground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//show skigrounds route
router.get("/", function(req, res) {
    Skiground.find({}, function(err, allSkigrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("skigrounds/index", {skigrounds: allSkigrounds, page: "skigrounds"});
        }
    });
});

//create skiground route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("skigrounds/new");
});

//create skiground route
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newSkiground = {name: name, price: price, image: image, description: description, author: author, location: location, lat: lat, lng: lng};
        Skiground.create(newSkiground, function(err, skiground) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/skigrounds");
            }
        });
    });
});

//one skiground show route
router.get("/:id", function(req, res) {
    Skiground.findById(req.params.id).populate("comments").exec(function(err, foundSkiground) {
        if (err) {
            console.log(err);
        } else {
            res.render("skigrounds/show", {skiground: foundSkiground});
        }
    });
});

//edit skiground route
router.get("/:id/edit", middleware.checkSkigroundOwnership, function(req, res) {
    Skiground.findById(req.params.id, function(err, foundSkiground) {
        res.render("skigrounds/edit", {skiground: foundSkiground});
    });
});

//update skiground route
router.put("/:id", middleware.checkSkigroundOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.skiground.lat = data[0].latitude;
        req.body.skiground.lng = data[0].longitude;
        req.body.skiground.location = data[0].formattedAddress;
        Skiground.findByIdAndUpdate(req.params.id, req.body.skiground, function(err, skiground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/skigrounds/" + skiground._id);
            }
        });
    });
});

//destroy skiground route
router.delete("/:id", middleware.checkSkigroundOwnership, function(req, res) {
    Skiground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/skigrounds");
        } else {
            res.redirect("/skigrounds");
        }
    });
});



module.exports = router;