var express = require("express");
var router = express.Router({mergeParams: true});
var Skiground = require("../models/skiground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new comments route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Skiground.findById(req.params.id, function(err, skiground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {skiground: skiground});
        }
    });
});

//create comment route
router.post("/", middleware.isLoggedIn, function(req, res) {
    Skiground.findById(req.params.id, function(err, skiground) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/skigrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    skiground.comments.push(comment);
                    skiground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/skigrounds/" + skiground._id);
                }
            });
        }
    });
});

//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {skiground_id: req.params.id, comment: foundComment});
        }
    });
});

//comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/skigrounds/" + req.params.id);
        }
    });
});

//comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/skigrounds/" + req.params.id);
        }
    });
});


module.exports = router;
