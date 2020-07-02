const AdminModel = require("../../models/AdministratorModel");
const authUtils = require("../../utils/authUtils");

module.exports = function(adminRouter) {
    adminRouter.get(
      '/profile',
      async (req,res) => {
          res.render('admin/profile/profile_base',
          {
              page: {
                  content: 'profile',
                  content_header: 'profile'
              },
              information: authUtils.getAdminProfile(req)
          });
      }
    );

    adminRouter.post(
      '/profile',
      async (req,res) => {

      }
    );
}