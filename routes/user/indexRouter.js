const router = require('express').Router();
const {
  showIndexPage, showAboutPage, showArticle, showContactPage, showTermsAndPolicy
} = require('../../controllers/user/index.controller');


router.get(['/', '/home', '/index'], showIndexPage);

router.get('/article', showArticle);

router.get('/category',
  async (req, res) => {
    try {
      const menu_list = await menuUtils.getMenuList();
      const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
      const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
      const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);

      if (req.query.id) {
        const articlesByCategory = await ArticleModel
          .find({
            $and: [{
              status: 'Published'
            }, {
              categoryId: req.query.id
            }]
          })
          .populate({
            path: 'categoryId',
            select: '_id name'
          })
          .populate({
            path: 'authorId',
            select: '_id profile'
          });

        if (articlesByCategory) {
          return res.render('user/article', {
            latestArticles: latestArticles,
            popularArticles: popularArticles,
            articlesByCategory: articlesByCategory,
            menu_list: menu_list,
          });
        }
      }

      return res.render("error/user-404");
    } catch (error) {
      return res.render("error/user-404");
    }
  }
);

router.get('/about', showAboutPage);

router.get('/contact', showContactPage);

router.get(['/terms_of_services', '/privacy_policy'], showTermsAndPolicy);

module.exports = router;