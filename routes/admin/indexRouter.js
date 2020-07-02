const authUtils = require("../../utils/authUtils");
const AdminModel = require("../../models/AdministratorModel");

module.exports = function(adminRouter) {
    
  adminRouter.get("/",
  async (req, res) => {
    const information = authUtils.getAdminProfile(req);

    return res.render("admin/index", 
    {
      information: information
    });
  }
  );

};
