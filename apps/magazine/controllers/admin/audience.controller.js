const AudienceModel = require('../../models/AudienceModel');
const authUtils = require('../../utils/authUtils');

module.exports  = {
    
    showAudienceList:  async (req, res) => {
        return res.render(
            "admin/audience/audience_base", {
                header: 'List of audiences',
                content: 'audience_list',
                audiences: await AudienceModel.find(),
                information: authUtils.getAdminProfile(req)
            });
    },

    deleteAudience:  async (req, res) => {
        try {
            const audience = await AudienceModel.findByIdAndDelete(req.body.id);

            if (audience) {
                req.flash("success", "Successfully. The audience was removed from the database.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process");
            }
            return res.redirect("/admin/audiences");
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/audiences'
                }
            );
        }
    }
}