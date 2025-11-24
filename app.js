import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import session from "express-session";
import bodyParser from 'body-parser';
import "./loadEnvironment.js";

const app = express();

const PORT = process.env.PORT || 5050;
const SECRET = process.env.SECRET;

// Getting all the routes
import authenticateRouter from "./routes/authenticate.js";
import dashboardRouter from "./routes/dashboard.js";
import booksRouter from "./routes/books.js";
import notesRotuer from "./routes/notes.js";


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const isProduction = process.env.NODE_ENV === "production";

app.use(cors({
    origin: isProduction 
        ? "https://arcananotes.vercel.app"
        : "http://localhost:5173", 
    credentials: true
}));

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

// middleware for session
app.set("trust proxy", 1); // trust first proxy

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SECRET,
    cookie: {
        expires: expiryDate,
        httpOnly: true,
        secure: isProduction, // set secure: true for HTTPS
        sameSite: isProduction ? "none" : "lax"
    }, 
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
app.use("/authenticate", authenticateRouter);
app.use("/dashboard", dashboardRouter);
app.use("/books", booksRouter);
app.use("/notes", notesRotuer);

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})
