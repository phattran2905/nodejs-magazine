const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const passportSetup = require('./config/passport-setup');
// router
const adminRouter = require("./routes/admin/index");
const userRouter = require("./routes/user/index");
const categoryRouter = require("./routes/admin/category");
const accountRouter = require("./routes/admin/account");
const authRouter = require("./routes/admin/auth");
const administratorRouter = require("./routes/admin/administrator");
const authorRouter = require("./routes/admin/author");

// Connect to database
mongoose.connect("mongodb://localhost/electronic_newspaper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.once("open", () =>
    console.log("Successfully connected to database")
);
mongoose.connection.on("error", () => {
    console.error.bind(console, "connection error:");
});

app.set("view engine", "ejs");
app.set('views','./views')
//  middleware
app.use("/static", express.static(path.join(__dirname, "public/user")));
app.use("/admin/static", express.static(path.join(__dirname, "public/admin/")));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: "Secret key for session",
    maxAge: 24*3600*1000*7,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
passportSetup(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes for Users
app.use("/", userRouter);
// Routes for Administrators
app.use("/admin", adminRouter);
app.use("/admin", categoryRouter);
app.use("/admin", accountRouter);
app.use("/admin", authRouter);
app.use("/admin", administratorRouter);
app.use("/admin", authorRouter);

// SET PORT
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening`); 
});
