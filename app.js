var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var monk = require('monk');
var db = monk('localhost:27017/spendings');
var expressValidator = require('express-validator');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes');
var errors = require('./routes/errors')

var app = express();

// PassportJS
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : false
}));
app.use(expressValidator(
        {
            errorFormatter: function(param, msg, value) { return msg; },
            customValidators: {
                minLength: function(param, num) {
                    return param.length >= num;
                },
                maxLength: function(param, num) {
                    return param.length <= num;
                },
                isEqual: function(param, str) {
                    return param == str;
                }
            }
        }
));
app.use(cookieParser());
app.use(session({
    secret: 'spendings',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// Session messages
app.use(function(req, res, next) {
    var session = req.session;
    var messages = session.messages || (session.messages = []);

    req.flash = function(message) {
        messages.push(message)
    }

    next()
})
app.use(express.static(path.join(__dirname, 'public')));

//Make our db accessible to our router
app.use(function(req, res, next){
    req.db = db;
    next();
});

app.use('/', routes);

errors(app);

module.exports = app;
