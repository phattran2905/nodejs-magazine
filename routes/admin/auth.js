const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

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
  }),
  async (req,res) => {
    await AdminModel.findOneAndUpdate( 
      { _id: req.user.id },
      {lastLogin : Date.now()}
      );
  }
);

authRouter.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/');
})

module.exports = authRouter;
