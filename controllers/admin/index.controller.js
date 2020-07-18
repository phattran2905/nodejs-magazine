const authUtils = require('../../utils/authUtils');

module.exports = {
    indexController: async (req, res) => {
        return res.render("admin/index", 
        {
            information: authUtils.getAdminProfile(req)
        });
    }
};