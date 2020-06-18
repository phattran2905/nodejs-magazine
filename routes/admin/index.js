// const express = require("express");
// const adminRouter = express.Router();
const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

module.exports = function(adminRouter, {passport}) {
    
  adminRouter.get("/",
  // authUtils.checkAuthenticatedAdmin,
  (req, res) => {
    console.log('admin: ');
    console.log(req.session);
    return res.send('logged');
    if (req.session.passport.user && req.session.passport.user.model === 'admin') {
      const loggedAdmin = AdminModel.findById(req.session.passport.user.id, (err, admin) => {
        if (err) {console.log(err); return null;}
        return {
          username: admin.username,
          email: admin.email,
          role: admin.role,
          status: admin.status
        }
      });
      
      if(loggedAdmin) return res.render("admin/index", {loggedAdmin: loggedAdmin});
      // return res.redirect('/login');
    }
  });

};
