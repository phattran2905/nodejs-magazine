const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const authUtils = require("../../utils/auth");

authRouter.get("/login", 
authUtils.checkNotAuthenticatedAdmin,
(req, res) => {
  res.render("admin/auth/login");
});

authRouter.post(
  "/login",
  authUtils.checkNotAuthenticatedAdmin,
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    successRedirect: "/admin",
    failureFlash: true,
  })
);

authRouter.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/');
})

module.exports = authRouter;
