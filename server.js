

const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const path = require("path");
const passportSetup = require('./config/passport-setup');

dotenv.config(path.join(__dirname, '.env'));

// Connect to database
mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost/electronic_newspaper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.connection.once("open", () =>
    console.log("Successfully connected to database")
);
mongoose.connection.on("error", () => {
    console.error.bind(console, "connection error:");
});

app.set("view engine", "ejs");
app.set('views',path.join(__dirname, "views"));
//  middleware
app.use("/static", express.static(path.join(__dirname, "public/user")));
app.use("/avatar", express.static(path.join(__dirname, "uploaded_files/avatar_img")));
app.use("/thumbnail", express.static(path.join(__dirname, "uploaded_files/thumbnail_img")));
app.use("/admin/static", express.static(path.join(__dirname, "public/admin/")));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    name: 'user.id',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    secret: process.env.SECRET_KEY || 'phatductran_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24*3600*1000*7,
    }
}));
app.use(flash());
passportSetup(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
// Routes for Users
app.use(require('./routes/user/routes') );

// Routes for Administration
app.use('/admin', (req,res, next) => {
    const authUtils = require('./utils/authUtils');
    if(req.url === '/login') {
        return authUtils.checkNotAuthenticatedAdmin(req,res,next);
    }else {
        return authUtils.checkAuthenticatedAdmin(req,res,next);
    }
},
require('./routes/admin/routes') );

// SET PORT
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 5000}`); 
});
