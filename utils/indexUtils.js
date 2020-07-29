const ArticleModel = require('../models/ArticleModel');
const AuthorModel = require('../models/AuthorModel');
const CommentModel = require('../models/CommentModel');
const AudienceModel = require('../models/AudienceModel');
const mongoose = require('mongoose'); 

module.exports = {
    getAuthorStatistics: async(year = new Date().getFullYear()) => {
        if (!year || year < new Date().getFullYear() - 5 || year > new Date().getFullYear()) 
            {return null;} // around  5 years;
        
        // Return { numOfFollower, numOfAuthors }
        return await AuthorModel.aggregate([
            {$match: {createdAt: { $gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) } }},
            {$project: { _id: 1 , 'size': {$size: '$followers'} }},
            {$group: { _id: null, totalFollowers: { $sum: '$size'}, totalAuthors: {$sum: 1}  }},
            {$project: { _id: 0, 'numOfFollowers': '$totalFollowers', 'numOfAuthors': '$totalAuthors' }},
        ]);
    },

    getArticleStatistics: async(year = new Date().getFullYear()) => {
        if (!year || year < new Date().getFullYear() - 5 || year > new Date().getFullYear()) 
            {return null;} // around  5 years;
        
        // Return { numOfViews, numOfArticles }
        return await ArticleModel.aggregate([
            {$match: {$and: [
                {status: 'Published'},
                {updated: {$gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) } }
            ]}},
            {$group: {
                _id: null,
                totalViews: { $sum: '$interaction.views' },
                totalArticles:  { $sum : 1 }
            }}, 
            {$project: { _id: 0, 'numOfViews': '$totalViews', 'numOfArticles': '$totalArticles' }}
        ]);
    },

    getYearlyStatistics: async function() {
        const thisYear = new Date().getFullYear();
        try {
            const authorDataThisYear = await this.getAuthorStatistics(thisYear);
            const articleDataThisYear = await this.getArticleStatistics(thisYear);
            const authorDataLastYear = await this.getAuthorStatistics(thisYear - 1);
            const articleDataLastYear = await this.getArticleStatistics(thisYear - 1);
            let diffRateArticle = {};
            let diffRateAuthor = {};
            if(authorDataLastYear > 0 && articleDataLastYear > 0) {
                diffRateArticle = {
                    numOfArticles: (articleDataThisYear[0].numOfArticles - articleDataLastYear[0].numOfArticles) * 100,
                    numOfViews: (articleDataThisYear[0].numOfViews - articleDataLastYear[0].numOfViews) * 100,
                };
                diffRateAuthor = {
                    numOfAuthors: (authorDataThisYear[0].numOfAuthors - authorDataLastYear[0].numOfAuthors) * 100,
                    numOfFollowers: (authorDataThisYear[0].numOfFollowers - authorDataLastYear[0].numOfFollowers) * 100,
                };
            }else {
                diffRateArticle = {
                    numOfArticles: articleDataThisYear[0].numOfArticles,
                    numOfViews: articleDataThisYear[0].numOfViews,
                };
                diffRateAuthor = {
                    numOfAuthors: authorDataThisYear[0].numOfAuthors,
                    numOfFollowers: authorDataThisYear[0].numOfFollowers,
                };
            }
            
            return {
                numOfArticles: { data: articleDataThisYear[0].numOfArticles, diffRate: diffRateArticle.numOfArticles },
                numOfViews:  { data: articleDataThisYear[0].numOfViews, diffRate: diffRateArticle.numOfViews },
                numOfAuthors:  { data: authorDataThisYear[0].numOfAuthors, diffRate: diffRateAuthor.numOfAuthors },
                numOfFollowers:  { data: authorDataThisYear[0].numOfFollowers, diffRate: diffRateAuthor.numOfFollowers },
            }
        } catch (error) {
            return null; 
        }
    },

    getNumOfViewsPerMonth: async (year = new Date().getFullYear()) => {
        if (!year || year < new Date().getFullYear() - 5 || year > new Date().getFullYear()) 
            {return null;} // around  5 years;

        const viewsPerMonth =  await ArticleModel.aggregate([
            {$match: {$and: [
                {status: 'Published'},
                {updated: {$gte: new Date(year, 1, 1), $lte: new Date(year, 12, 31) } }
            ]}},
            {$project: { _id: 1, 'month': {$month: '$updated'}, 'views': '$interaction.views' }},
            {$group: {
                _id: '$month',
                totalViews: { $sum: '$views' },
            }},
            {$project: { _id: 0,  'numOfViews': '$totalViews' }}
        ]);
        return viewsPerMonth;
    },

    getViewAnalyticsForChart: async function() {
        try {   
            const viewsPerMonthThisYear = await this.getNumOfViewsPerMonth(new Date().getFullYear()); 
            const viewsPerMonthLastYear = await this.getNumOfViewsPerMonth(new Date().getFullYear() - 1);
            const dataForChartThisYear = viewsPerMonthThisYear.map(element => element.numOfViews);
            const dataForChartLastYear = viewsPerMonthLastYear.map(element => element.numOfViews);
            return {
                thisYear: { data: dataForChartThisYear, name: new Date().getFullYear().toString() },
                lastYear: { data: dataForChartLastYear, name: (new Date().getFullYear() -1 ).toString() },
            }   
        } catch (error) {
            return null;
        }
    },

    getNumOfViewsByTime: async function(date_str = new Date()){
        if (!date_str) {return null;}

        try {
            const viewsPerDay = await ArticleModel.aggregate([
                {$match: {$and: {status: 'Published'} }},
                {$project: { _id: 1, 'day': {$dayOfMonth: '$updated'}, 'views': '$interaction.views' }},
                {$match: { '$day': {$eq: {$dayOfMonth: new Date(date_str)} } } },
                {$group: {
                    _id: '$day',
                    totalViews: { $sum: '$interaction.views' },
                }}, 
                {$project: { _id: 0, 'numOfViews': '$totalViews'}}
            ]);
            const viewsPerWeek = await ArticleModel.aggregate([
                {$match: {$and: {status: 'Published'} }},
                {$project: { _id: 1, 'week': {$week: '$updated'}, 'views': '$interaction.views' }},
                {$match: { '$week': {$eq: {$week: new Date(date_str)} } } },
                {$group: {
                    _id: '$week',
                    totalViews: { $sum: '$interaction.views' },
                }}, 
                {$project: { _id: 0, 'numOfViews': '$totalViews'}}
            ]);
            const viewsPerMonth = await ArticleModel.aggregate([
                {$match: {$and: {status: 'Published'} }},
                {$project: { _id: 1, 'month': {$month: '$updated'}, 'views': '$interaction.views' }},
                {$match: { '$month': {$eq: {$week: new Date(date_str)} } } },
                {$group: {
                    _id: '$month',
                    totalViews: { $sum: '$interaction.views' },
                }}, 
                {$project: { _id: 0, 'numOfViews': '$totalViews'}}
            ]);
            const viewsPerYear = await ArticleModel.aggregate([
                {$match: {$and: [
                    {status: 'Published'},
                    {updated: {$gte: new Date(date_str.getFullYear(), 1, 1), $lte: new Date(date_str.getFullYear(), 12, 31) } }
                ]}},
                {$group: {
                    _id: null,
                    totalViews: { $sum: '$interaction.views' },
                }}, 
                {$project: { _id: 0, 'numOfViews': '$totalViews'}}
            ]);
            
            return {
                day: viewsPerDay[0].numOfViews,
                week: viewsPerWeek[0].numOfViews,
                month: viewsPerMonth[0].numOfViews,
                year: viewsPerYear[0].numOfViews,
            }
        } catch (error) {
            return null;
        }

    },

}