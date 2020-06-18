// const express = require("express");
// const authRouter = express.Router();
// const passport = require("passport");
const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

module.exports = function (adminRouter, {passport}){
    
  adminRouter.get("/login", 
  authUtils.checkNotAuthenticatedAdmin,
  (req, res) => {
    res.render("admin/auth/login");
  });

  adminRouter.post(
    "/login",
    authUtils.checkNotAuthenticatedAdmin,
    passport.authenticate("auth-admin", {
      failureRedirect: "/admin/login",
      // successRedirect: "/admin",
      failureFlash: true,
    }),
    async (req,res) => {
      req.session.admin = req.user;
      // console.log('admin: ' + req.user);
      console.log(req.session);
      // res.send('logged');
      res.redirect('/admin');
    }
  );

  adminRouter.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
  })

};
