const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
const session = require("express-session")
require("./loadEnvironment.js");
const hash = require("bcrypt");

// Getting all the routes
//var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require("./routes/login.js")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware for session
app.set("trust proxy", 1); // trust first proxy
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "shhh, very secret",
    cookie: {} // set secure: true for HTTPS
}));

app.use(function(req,res, next){
    var err = req.session.error;
    var msg = req.session.message;
    delete req.session.error;
    delete req.session.message;

    res.locals.message = "";

    if(err) res.locals.message = '<p>' + err + '</p>';
    if(msg) res.locals.message = '<p>' + msg + '</p>';
    next();
})

usersRouter(app);
loginRouter(app);
//app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
