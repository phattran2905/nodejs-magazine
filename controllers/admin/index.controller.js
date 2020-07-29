const authUtils = require('../../utils/authUtils');
const indexUtils = require('../../utils/indexUtils');
const AuthorModel = require('../../models/AuthorModel');

module.exports = {
    indexController: async (req, res) => {
        const yearlyStatistics = await indexUtils.getYearlyStatistics();
        const viewsAnalytics = await indexUtils.getViewAnalyticsForChart();
        const numOfViewsByTime = await indexUtils.getNumOfViewsByTime();
        const authors = await AuthorModel.find().sort({createdAt: '-1'}).limit(8);
        return res.render("admin/index", 
        {
            yearlyStatistics: yearlyStatistics,
            viewsAnalytics: viewsAnalytics,
            numOfViewsByTime: numOfViewsByTime,
            authors: authors,
            information: authUtils.getAdminProfile(req)
        });
    },

};