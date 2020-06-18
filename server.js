const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require('passport');
const adminPassport = require('./passports/adminPassport');
const session = require('express-session');
const flash = require('express-flash');
const passportSetup = require('./config/passport-setup');
// router
const router = require('./routes/router');
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

const path = require("path");
app.set("view engine", "ejs");
app.set('views',path.join(__dirname, "views"));
//  middleware
app.use("/static", express.static(path.join(__dirname, "public/user")));
app.use("/admin/static", express.static(path.join(__dirname, "public/admin/")));
app.use(express.urlencoded({extended: false}));
// app.use('/', session({
//     name: 'user-client',
//     secret: "User/Client",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         name: 'user_sessionID',
//         maxAge: 24*3600*1000*7,
//         // sameSite: true,
//     }
// }));
app.use(flash());
// passportSetup(passport);
// app.use(adminPassport.initialize());
// app.use(adminPassport.session());

// Routes for Users
// app.use(router.userRouter);
// app.use(router.user_authRouter);
const userRouter = require('./routes/user/userRouter');
// userRouter.use(session({
//     name: 'user-client',
//     secret: "User/Client",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         path: '/',
//         maxAge: 24*3600*1000*7,
//         // sameSite: true,
//     }
// }));
app.use(userRouter);

// Routes for Administrators
// app.use("/admin", router.admin_authRouter);
// app.use("/admin", router.adminRouter);
// app.use("/admin", router.categoryRouter);
// app.use("/admin", router.accountRouter);
// app.use("/admin", router.administratorRouter);
// app.use("/admin", router.authorRouter);
// app.use("/admin", router.articleRouter);

const adminRouter = require('./routes/admin/adminRouter');
// app.use('/', session({
//     name: 'admin',
//     secret: "admin",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         path: '/admin',
//         maxAge: 24*3600*1000*7,
//         // sameSite: true,
//     }
// }));
app.use('/admin', adminRouter);

// SET PORT
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening`); 
});
