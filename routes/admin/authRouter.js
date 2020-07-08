// const express = require("express");
// const authRouter = express.Router();
const passport = require("passport");
const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

module.exports = function (adminRouter){
  
  adminRouter.get("/login", 
    authUtils.checkNotAuthenticatedAdmin,
    (req, res) => {
      res.render("admin/auth/login");
  });

  adminRouter.post(
    "/login",
    authUtils.checkNotAuthenticatedAdmin,
    passport.authenticate("auth-admin", 
    {
      failureRedirect: "/admin/login",
      failureFlash: true,
    }),
    async (req, res, next) => {
      if (!req.body.remember_me) {return next();}

      try {
        const newToken = require('nanoid').nanoid(64);
        const admin = await AdminModel.findOneAndUpdate({_id: req.user._id},{remember_token: newToken});
        if(admin) {
          res.cookie('remember_me_adm', admin.remember_token, 
              { path: '/admin', httpOnly: true, maxAge: 604800000 }
          );
        }
        return next(); 
      } catch (error) {
        return error;
      }
    },
    async (req,res) => {
      req.session.admin = req.user;
      res.redirect('/admin');
    }
  );

  adminRouter.get('/logout', (req,res) => {
    res.clearCookie('remember_me_adm',{path:'/admin'});
    req.logout();
    req.session.admin = undefined;
    res.redirect('/admin/login');
  })

};
