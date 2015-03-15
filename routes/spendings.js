/**
 * Created by iliyan on 2/10/15.
 */
var bcrypt = require('bcrypt');

function SpendingsHandler(){
    "use strict";

    this.displayHome = function(req, res){
        "use strict"
        res.render('index', {
            title: 'Spendings app',
            sessionMessage: req.session.messages.pop(),
            partials: {
                layout: 'layout'
            }
        });
    }

    this.displayAddNew = function (req, res) {
        res.render('add', {
            title: 'Add new spending',
            sessionMessage: req.session.messages.pop(),
            fields: [
                {
                    'field': 'amount'
                },
                {
                    'field': 'name'
                },
                {
                    'field': 'date'
                }
            ],
            partials: {
                layout: 'layout'
            }
        });
    }

    this.handleAddNew = function (req, res) {
        // validation
        req.checkBody('amount', 'Invalid amount').isFloat();
        req.checkBody('name', 'Invalid name').notEmpty();
        req.checkBody('date', 'Invalid date').isDate();

        var errors = req.validationErrors();
        if (errors) {
            req.flash("There have been validation errors: " + errors.join(", "));
            res.redirect('/add');
            return;
        }
        // POST data
        var postData;
        postData = {
            amount: req.body.amount,
            name: req.body.name,
            date: req.body.date
        };

        var db = req.db;
        var collection = db.get('spendings');

        // Submit to DB
        collection.insert(postData, function (e, docs) {
            if (e) {
                // If failed return error
                req.flash("Error");
                res.send("Error adding to DB.");
            }
            // If it worked, set the header
            //res.location("/add");
            // Add session message
            req.flash("Success");
            // And forward to success page
            res.redirect("/view");
        });
    }

    this.displayViewAll = function (req, res) {
        var query;
        if (!req.params.id)
            query = {};
        else query = {_id: req.params.id};

        var db = req.db;
        var collection = db.get('spendings');
        collection.find(query,function(e, docs) {
            if (e){
                res.send("Error reading from DB.");
            } else {
                res.render('view', {
                    sessionMessage: req.session.messages.pop(),
                    title: 'View spendings',
                    spendings: docs,
                    partials: {
                        layout: 'layout'
                    }
                });
            }
        });
    }

    this.handleRemove = function (req, res) {
        var db = req.db;
        var collection = db.get('spendings');
        collection.remove({_id: req.body.id}, function(e, docs) {
            if (e) {
                req.flash("Error");
                res.send("Error deleting from DB.");
            }
            // Add session message
            req.flash("Success");
            // And forward to success page
            res.redirect("/view");
        });
    }

    this.displaySignup = function(req, res) {
        res.render('signup', {
            title: 'Register new account',
            sessionMessage: req.session.messages.pop(),
            partials: {
                layout: 'layout'
            }
        });
    }

    this.handleSignup = function(req, res) {
        // validation
        req.checkBody('inputFirstName', 'Enter first name').notEmpty();
        req.checkBody('inputLastName', 'Enter last name').notEmpty();
        req.checkBody('inputEmail', 'Invalid email').isEmail();
        req.checkBody('inputPassword', 'Password must be from 5 to 25 symbols').notEmpty().minLength(5).maxLength(25);
        req.checkBody('inputPasswordAgain', 'Passwords did not match').notEmpty().isEqual(req.body.inputPassword);

        var errors = req.validationErrors();

        if (errors) {
            req.flash("There have been validation errors: " + errors.join(", "));
            res.redirect('/signup');
            return;
        }

        var db = req.db;
        var collection = db.get('users');

        collection.findOne({email: req.body.inputEmail}, function(err, user){
            if (err) throw err;
            if (user) {
                req.flash("There is an user with this email: " + user.email);
                res.redirect('/signup');
                return;
            }

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(req.body.inputPassword, salt, function(err, hash){
                    if (err) throw err;

                    // POST data
                    var postData;
                    postData = {
                        'email': req.body.inputEmail,
                        'firstName': req.body.inputFirstName,
                        'lastName': req.body.inputLastName,
                        'password': hash // hashed password
                    };

                    // Submit to DB
                    collection.insert(postData, function (e, docs) {
                        if (e) {
                            // If failed return error
                            req.flash("Error");
                            res.send("Error adding to DB.");
                        }
                        // If it worked, set the header
                        // Add session message
                        req.flash("Congratulations! You have an account.");
                        // And forward to success page
                        res.redirect("/");
                    });
                })
            });
        })

    }

}
module.exports = SpendingsHandler;