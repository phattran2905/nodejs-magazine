const upload = require('../../config/upload-setup');
const ArticleModel = require('../../models/ArticleModel');
const CategoryModel = require('../../models/CategoryModel');
const authUtils = require('../../utils/authUtils');
const commonUtils = require('../../utils/commonUtils');
const articleUtils = require('../../utils/articleUtils');
const {body, matchedData, validationResult} = require('express-validator');

module.exports = function(adminRouter) {
    adminRouter.get(
        '/articles',
        async (req,res) => {
            // const information = authUtils.getAdminProfile(req);
            const articles = await ArticleModel.find();
            res.render(
                'admin/article/article', 
                {
                    articles: articles,
                    information: authUtils.getAdminProfile(req)
                });
        }
    );
    
    adminRouter.get(
        '/articles/add',
        async (req,res) => {
            const categories = await CategoryModel.find();
            res.render(
                'admin/article/article_add',
                {
                    categories: categories,
                    information: authUtils.getAdminProfile(req)
                });
        }
    );
    
    adminRouter.post(
        '/articles/add',
        [
            // body('title').isAlphanumeric(),
            // body('summary').isAlphanumeric(),
            // body('thumbnail_img').isMimeType(),
            // body('body').bail(),
            // body('category').toBoolean(),
        ],
        upload.fields([
            {name: 'thumbnail_img'},
            {name: 'files'}
        ]),
        async (req,res) => {
            const errors = validationResult(req);
            const validInput = matchedData(req);
            
            if(!errors.isEmpty()) {
                const categories = await CategoryModel.find();
                return res.render(
                    'admin/article/article_add',
                    {
                        categories: categories,
                        errors:  errors.array(),
                        validInput: validInput,
                        information: authUtils.getAdminProfile(req)
                    }
                )
            }
            const authorID = req.user.id;
    
            try {
                const addedArticle = await articleUtils.createNewArticle(authorID,req.body,req.files.thumbnail_img);
                console.log(addedArticle);
                if(addedArticle) {
                    req.flash('addSuccess', 'Successfully. The article was created.');
                }else {
                    req.flash('addFail', 'Failed. An error occurred during the process.');
                }
                return res.redirect("/admin/articles/add");
            } catch (error) {
                console.log(error);
            }
        }
    );
    
    adminRouter.get(
        '/articles/preview/:id',
        async (req,res) => {
            try {
                const article = await ArticleModel.findById({_id: req.params.id});
                if (!article) {
                    return redirect('/admin/articles');
                }
                const categoryName = await CategoryModel.findById(article.categoryId);
                console.log(categoryName);
                res.render ('admin/article/article_preview', 
                {
                    article: article,
                    categoryName: categoryName,
                    information: authUtils.getAdminProfile(req)
                });
            }catch (error) {
                res.sendStatus(404).render("pages/404");
            }
            
        }
    );
    
}
