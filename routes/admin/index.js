// const express = require("express");
// const adminRouter = express.Router();
const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

module.exports = function(adminRouter) {
    
  adminRouter.get("/",
  authUtils.checkAuthenticatedAdmin,
  async (req, res) => {
    // console.log(req.session);
    // console.log('admin: ');
    // console.log(req.user);
    // return res.send('logged');
    if (typeof req.session.admin !== 'undefined' && req.session.admin ) {
      const loggedAdmin = {
        username: req.session.admin.username,
        email: req.session.admin.email,
        role: req.session.admin.role,
        status: req.session.admin.status
      }
      console.log(loggedAdmin);
      if(loggedAdmin) return res.render("admin/index", {loggedAdmin: loggedAdmin});
      // return res.redirect('/login');
    }
  });

};
