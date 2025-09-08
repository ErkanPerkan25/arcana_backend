import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import session from "express-session";
import "./loadEnvironment.js";

// Getting all the routes
//var indexRouter = require('./routes/index');
import loginRouter from "./routes/login.js";
import signUpRouter from "./routes/sign_up.js"

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// middleware for session
app.set("trust proxy", 1); // trust first proxy
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "shhh, very secret",
    cookie: {} // set secure: true for HTTPS
}));

app.use(function(req,res, next){
    const err = req.session.error;
    const msg = req.session.message;
    delete req.session.error;
    delete req.session.message;

    res.locals.message = "";

    if(err) res.locals.message = '<p>' + err + '</p>';
    if(msg) res.locals.message = '<p>' + msg + '</p>';
    next();
})

// Set the paths for usage
app.use('/login', loginRouter);
app.use("/signUp", signUpRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})
