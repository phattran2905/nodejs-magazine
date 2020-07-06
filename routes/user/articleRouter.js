const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');
const validateProfile = require('../../validation/user/validateProfile');
const upload = require('../../config/upload-setup');

module.exports = function(userRouter) {
    
    userRouter.get(
        '/articles',
        (req, res) => {
            res.render('user/article/article_base', {
                page:  {
                    content: 'article_list',
                    header: 'Article'
                },
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

    userRouter.get(
        '/articles/add',
        (req, res) => {
            res.render('user/article/article_base', {
                page:  {
                    content: 'article_add',
                    header: 'Article'
                },
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

};