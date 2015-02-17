/**
 * Created by iliyan on 2/10/15.
 */
function SpendingsHandler(){
    "use strict";

    this.displayHome = function(req, res){
        "use strict"
        res.render('index', {
            title: 'Spendings app',
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

}
module.exports = SpendingsHandler;