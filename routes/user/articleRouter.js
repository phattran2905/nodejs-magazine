const CategoryModel = require('../../models/CategoryModel');
const ArticleModel = require('../../models/ArticleModel');
const authUtils = require('../../utils/authUtils');
const articleUtils = require('../../utils/articleUtils');
const validateArticle = require('../../validation/user/validateArticle');
const upload = require('../../config/upload-setup');

module.exports = function(userRouter) {
    
    userRouter.get(
        '/articles',
        async (req, res) => {
            const categories = await CategoryModel.find();
            const articles = await ArticleModel.find(
                {authorId: authUtils.getAuthorProfile(req).id}
                );

            for(let i = 0; i < categories.length; i++) {
                for (let j = 0; j < articles.length; j++) {
                    if (articles[j].categoryId.toString() == categories[i]._id.toString()){
                        articles[j].categoryName = categories[i].name;
                    }
                }
            }
            res.render('user/article/article_base', {
                content: 'article_list',
                header: 'Article',
                articles: articles,
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

    userRouter.get(
        '/articles/preview/:articleId',
        async (req,res) => {
            try {
                const article = await articleUtils.getArticleById(req.params.articleId);
                if (article) {
                    return res.render('user/article/article_base', {
                        content: 'article_preview',
                        header: 'Article',
                        article: article,
                        information: authUtils.getAuthorProfile(req)
                    });
                }
                return res.render(
                    "pages/404", 
                    {redirectLink: '/articles'}
                  );
            } catch (error) {
                return res.render(
                    "pages/404", 
                    {redirectLink: '/articles'}
                  );
            }

        }
    );

    userRouter.get(
        '/articles/add',
        async (req, res) => {
            const categories = await CategoryModel.find();
            
            res.render('user/article/article_base', {
                content: 'article_add',
                header: 'Article',
                categories: categories,
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

    userRouter.post(
        '/articles/add',
        upload.fields([
            { name: 'thumbnail_img', maxCount: 1 },
            { name: 'files', maxCount: 3 }
          ]),
        validateArticle.add,
        async (req, res) => {
            const { hasError, errors, validInput } = validateArticle.result(req);
            
            if(hasError) {
                const categories = await CategoryModel.find();
                return  res.render('user/article/article_base',{
                    errors: errors, 
                    validInput: validInput,
                    content: 'article_add',
                    header: 'Article',
                    categories: categories,
                    information: authUtils.getAuthorProfile(req)
                });
            };
            try {
                
                const article = await articleUtils.createNewArticle(
                    {
                        authorId: req.body.authorId,
                        categoryId: req.body.categoryId,
                        title: req.body.title,
                        summary: req.body.summary,
                        thumbnail_img: req.files.thumbnail_img[0], 
                        body: req.body.body,
                        publishCheck: req.body.publishCheck
                    });
                
                if(article) {
                    req.flash('success', 'Successfully! You created a new article');
                    return res.redirect('/articles/add');
                }

                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/articles/add');
            } catch (error) {
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/articles/add');
            }
        }
    );

    
    userRouter.post(
        "/articles/publish", 
        async (req, res) => {
        try {
            const article = await ArticleModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, {status: 'Draft'}] },
                { status: 'Pending'} );
            
            if (article) {
                req.flash("success", "Successfully. The article was waiting for approval.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/articles");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/articles'}
            );
        }}
    );

    userRouter.post(
        "/articles/unpublish", 
        async (req, res) => {
        try {
            const article = await ArticleModel.findOneAndUpdate(
                { $and: [{_id: req.body.id}, 
                    {$or: [{status: 'Published'},{status: 'Pending'}]} ] 
                },
                { status: 'Draft'} );
            
            if (article) {
                req.flash("success", "Successfully. The article was unpublished.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/articles");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/articles'}
            );
        }}
    );

    userRouter.post(
        "/articles/delete/", 
        async (req, res) => {
        try {
            const article = await ArticleModel.findByIdAndDelete(req.body.id);
            
            if (article) {
                req.flash("success", "Successfully. The article was removed.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process");
            }
            return res.redirect("/articles");
        } catch (error) {
            return res.render(
                "pages/404", 
                {redirectLink: '/articles'}
            );
        }}
    );
};