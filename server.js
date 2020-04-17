const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// router
const adminRouter = require("./routes/admin/index");
const userRouter = require("./routes/user/index");
const categoryRouter = require("./routes/admin/category");
const accountRouter = require("./routes/admin/account");
const authRouter = require("./routes/admin/auth");

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
// app.set('views','./views')
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}))
// Routes
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/admin", categoryRouter);
app.use("/admin", accountRouter);
app.use("/admin", authRouter);

// SET PORT
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening`); 
});
