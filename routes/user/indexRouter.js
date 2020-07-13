const authUtils = require('../../utils/authUtils');
const MenuModel = require('../../models/MenuModel');
const ArticleModel = require('../../models/ArticleModel');

module.exports = function(userRouter) {

    userRouter.get('/',
      async (req,res) => { 
        const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
        const article_list = await ArticleModel
          .find({status: 'Activated'}, '_id title interaction status categoryId authorId updated createdAt')
          .populate({
            path: 'authorId',
            select: '_id profile'
          })
          .populate({
            path: 'categoryId',
            select: '_id name'
          });
          
        return res.render('user/index', 
        {
          menu_list: menu_list,
          article_list: article_list,
          information: authUtils.getAuthorProfile(req)
        });
    });

};