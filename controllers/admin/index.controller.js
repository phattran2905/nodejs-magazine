const authUtils = require('../../utils/authUtils');
const indexUtils = require('../../utils/indexUtils');

module.exports = {
    indexController: async (req, res) => {
        const yearlyStatistics = await indexUtils.getYearlyStatistics();
        const viewsAnalytics = await indexUtils.getViewAnalytics();
        
        return res.render("admin/index", 
        {
            yearlyStatistics: yearlyStatistics,
            viewsAnalytics: viewsAnalytics,
            information: authUtils.getAdminProfile(req)
        });
    },

};