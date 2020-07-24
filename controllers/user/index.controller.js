const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');
const commonUtils = require('../../utils/commonUtils');
const articleUtils = require('../../utils/articleUtils');
const categoryUtils = require('../../utils/categoryUtils');
const AudienceModel = require('../../models/AudienceModel');
const ArticleModel = require('../../models/ArticleModel');
const CategoryModel = require('../../models/CategoryModel');
const menuUtils = require('../../utils/menuUtils');
const AuthorModel = require('../../models/AuthorModel');

module.exports = {
    showIndexPage: async (req, res) => {
      try {
        const selectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
        const latestArticles = await articleUtils.getLatestArticles(selectedFields, 5);
        const popularArticles = await articleUtils.getPopularArticles(selectedFields, 5); // Most views
        const categoryWithPostCounted = await categoryUtils.getNumOfArticleByCategory();
        const mainCategories = await CategoryModel.find({status: 'Activated'}, '_id name').sort({createdAt: 'asc'}).limit(4);
        console.log(categoryWithPostCounted)
        return res.render('user/index', {
          menu_list: await menuUtils.getMenuList(),
          latestArticles: latestArticles,
          popularArticles: popularArticles,
          articlesByMainCategories: await articleUtils.getArticlesForMainCategories(mainCategories, 3, selectedFields),
          categoryWithPostCounted: categoryWithPostCounted,
          information: authUtils.getAuthorProfile(req)
        });
      } catch (error) {
        return res.render(
          "error/user-404", {
            redirectLink: '/'
          }
        );
      }
    },
  
    showArticle: async (req, res) => {
        if (req.query.id) {
          try {
            const articleSelectedFields = '_id title body summary interaction status categoryId authorId updated createdAt thumbnail_img';
            const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
            const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);
    
            const article = await articleUtils.getArticleById(req.query.id);
            if (article) {
              const updatedArticle = await ArticleModel.findOneAndUpdate({
                _id: req.query.id
              }, {
                'interaction.views': article.interaction.views + 1
              });
    
              if (updatedArticle) {
                return res.render('user/article', {
                  latestArticles: latestArticles,
                  popularArticles: popularArticles,
                  article: await articleUtils.getArticleById(req.query.id, articleSelectedFields),
                  menu_list: await menuUtils.getMenuList(),
                  information: authUtils.getAuthorProfile(req)
                });
              }
            }

          } catch (error) {
            return res.render("error/user-404");
          }
        }

        return res.render("error/user-404");
    },
  
    showArticlesByCategoryId: async (req, res) => {
      if (req.query.id) {
        try {
          const articleSelectedFields = '_id title body summary interaction status categoryId authorId updated createdAt thumbnail_img';
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);
          const articlesByCategory = await articleUtils.getArticleByCategoryId(req.query.id, articleSelectedFields);

          if (articlesByCategory) {
            const currentPage = (typeof req.query.page !== 'undefined' && req.query.page > 0) 
            ? req.query.page 
            : 1;

            const pagination = commonUtils.makePagination({
              items: articlesByCategory,
              itemPerPage: 6,
              currentPage: currentPage
            });

            if (currentPage && pagination) {
              return res.render('user/articles_by_category.ejs', {
                latestArticles: latestArticles,
                popularArticles: popularArticles,
                menu_list: await menuUtils.getMenuList(),
                information: authUtils.getAuthorProfile(req),
                pagination: pagination
              });
            }
           
          }
        } catch (error) {
          return res.render("error/user-404");
        }
      }
      return res.render("error/user-404");
    },
  
    searchArticlesByTitle: async (req, res) => {
      if (req.query.title) {
        try {
          const articleSelectedFields = '_id title body summary interaction status categoryId authorId updated createdAt thumbnail_img';
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);

          const articlesByTitle = await articleUtils.getArticleByTitle(req.query.title, articleSelectedFields);
          
          if (articlesByTitle) {
            const currentPage = (typeof req.query.page !== 'undefined' && req.query.page > 0) 
            ? req.query.page 
            : 1;

            const pagination = commonUtils.makePagination({
              items: articlesByTitle,
              itemPerPage: 6,
              currentPage: currentPage
            });

            if (currentPage && pagination) {
              return res.render('user/search.ejs', {
                latestArticles: latestArticles,
                popularArticles: popularArticles,
                menu_list: await menuUtils.getMenuList(),
                information: authUtils.getAuthorProfile(req),
                pagination: pagination
              });
            }
          }

          return res.render('user/search.ejs', {
            latestArticles: latestArticles,
            popularArticles: popularArticles,
            menu_list: await menuUtils.getMenuList(),
            information: authUtils.getAuthorProfile(req)
          });
        } catch (error) {
          return res.render("error/user-404");
        }
      }
      return res.render("error/user-404");
    },

    showAuthorPage: async (req, res) => {
        if (req.query.id) {
          try {
            const articleSelectedFields = '_id title body summary interaction status categoryId authorId updated createdAt thumbnail_img';
            const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
            const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);
            
            const author = await authorUtils.getAuthorById(req.query.id);

            if (author) {
              const currentPage = (typeof req.query.page !== 'undefined' && req.query.page > 0) 
                  ? req.query.page 
                  : 1;

              const pagination = commonUtils.makePagination({
                items: author.articles,
                itemPerPage: 6,
                currentPage: currentPage
              });

              if (currentPage && pagination) {
                return res.render('user/author', {
                  latestArticles: latestArticles,
                  popularArticles: popularArticles,
                  author: author,
                  menu_list: await menuUtils.getMenuList(),
                  information: authUtils.getAuthorProfile(req),
                  pagination: pagination
                });
              }
            }
            
          } catch (error) {
            return res.render("error/user-404");
          }
        }

        return res.render("error/user-404");
    },
    
    followAuthor: async (req, res) => {
        if (req.query.id) {
          try {
            const author = await authorUtils.getAuthorById(req.query.id);
            
            if (author) {
              if (!await commonUtils.isExistentAudienceEmail(req.body.email)) {
                let followers = author.info.followers;
                const audience = await AudienceModel.create({
                  email: req.body.email
                });
                
                if (audience) {
                  followers.push(audience._id);
                  await AuthorModel.updateOne({_id: author.info._id},{followers: followers});
                } 
              }else if(!await commonUtils.isAlreadyFollower(author.info._id,req.body.email)){
                //Existent email but not a follower
                  followers.push(audience._id);
                  await AuthorModel.updateOne({_id: author.info._id},{followers: followers});
              }
              
              req.flash('success', 'Successfully! A notify email will send whenever a new article goes public.');
              return res.redirect(`/author?id=${author.info._id}`);
            }
            
          } catch (error) {
            return res.render("error/user-404");
          }
        }

        return res.render("error/user-404");
    },
    
    showAboutPage: async (req, res) => {
      try {
        const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
        const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
        const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);
  
        return res.render('user/about', {
          menu_list: await menuUtils.getMenuList(),
          latestArticles: latestArticles,
          popularArticles: popularArticles,
          information: authUtils.getAuthorProfile(req)
        });
      } catch (error) {
        return res.render("error/user-404");
      }
    },
  
    showContactPage: async (req, res) => {
      try {
        const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
        const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
        const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);
  
        return res.render('user/contact', {
          menu_list: await menuUtils.getMenuList(),
          latestArticles: latestArticles,
          popularArticles: popularArticles,
          information: authUtils.getAuthorProfile(req)
        });
      } catch (error) {
        return res.render("error/user-404");
      }
    },

    showTermsAndPolicy: async (req, res) => {
      try {
        const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
        const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
        const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);
  
        return res.render('user/terms_of_services', {
          menu_list: await menuUtils.getMenuList(),
          latestArticles: latestArticles,
          popularArticles: popularArticles,
          information: authUtils.getAuthorProfile(req)
        });
      } catch (error) {
        return res.render("error/user-404", );
      }
    }
  
}