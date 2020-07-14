const authUtils = require('../../utils/authUtils');
const articleUtils = require('../../utils/articleUtils');
const categoryUtils = require('../../utils/categoryUtils');
const MenuModel = require('../../models/MenuModel');
const ArticleModel = require('../../models/ArticleModel');
const CategoryModel = require('../../models/CategoryModel');

module.exports = function(userRouter) {

    userRouter.get(
      ['/', '/home', '/index'],
      async (req,res) => { 
        const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
        const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
        const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
        const hotArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
        const categoryWithPostCounted = await categoryUtils.getNumOfArticleByCategory();
        let articlesByHotCategory = Array();

        const hotCategories = await CategoryModel
          .find({status: 'Activated'}, '_id name')
          .sort({createdAt: 'asc'})
          .limit(4);

        for(let i =0; i < hotCategories.length; i++){
          articlesByHotCategory.push(
            {
              category: hotCategories[i],
              articles: await articleUtils.getArticleByCategory(hotCategories[i]._id, 5, articleSelectedFields)
            }
          )
        };
        console.log(hotArticles);
        return res.render('user/index', 
        {
          menu_list: menu_list,
          latestArticles: latestArticles,
          hotArticles: hotArticles,
          articlesByHotCategory: articlesByHotCategory,
          categoryWithPostCounted: categoryWithPostCounted,
          information: authUtils.getAuthorProfile(req)
        });
    });

};