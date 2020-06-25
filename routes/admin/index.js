const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

module.exports = function(adminRouter) {
    
  adminRouter.get("/",
  async (req, res) => {
    if (typeof req.session.admin !== 'undefined' && req.session.admin ) {
      const loggedAdmin = {
        username: req.session.admin.username,
        email: req.session.admin.email,
        role: req.session.admin.role,
        status: req.session.admin.status
      }
      
      if(loggedAdmin) return res.render("admin/index", {loggedAdmin: loggedAdmin});
      // return res.redirect('/login');
    }
  });

};
