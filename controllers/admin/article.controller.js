const ArticleModel = require('../../models/ArticleModel');
const authUtils = require('../../utils/authUtils.js');

module.exports = {
    showArticleList: async (req, res) => {
        let by_status = {
            status: {
                $ne: 'Draft'
            }
        }; // Show all except 'Draft'
        if (req.query.by_status === 'pending') {
            by_status = {
                status: 'Pending'
            };
        } else if (req.query.by_status === 'published') {
            by_status = {
                status: 'Published'
            };
        } else if (req.query.by_status === 'disapproved') {
            by_status = {
                status: 'Disapproved'
            };
        }
        const returnFields = '_id title interaction status categoryId authorId updated createdAt';
        const articles = await ArticleModel
            .find(by_status, returnFields)
            .populate({
                path: 'categoryId',
                select: '_id name'
            })
            .populate({
                path: 'authorId',
                select: '_id profile.fullname'
            });

        return res.render(
            'admin/article/article_base', {
                content: 'article_list',
                header: 'List of articles',
                articles: articles,
                information: authUtils.getAdminProfile(req)
            });
    },

    preview:  async (req, res) => {
        try {
            const article = await ArticleModel
                .findById({
                    _id: req.params.id
                })
                .populate({
                    path: 'categoryId',
                    select: '_id name'
                })
                .populate({
                    path: 'authorId',
                    select: '_id profile.fullname profile.avatar_img'
                });
            if (article) {
                res.render('admin/article/article_base', {
                    content: 'article_preview',
                    header: 'Preview',
                    article: article,
                    information: authUtils.getAdminProfile(req)
                });
            }
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/articles?by_status=all'
                }
            );
        }

    },

    publish: async (req, res) => {
        const status = (req.query.status == null || req.query.status === 'All') ?
            'All' :
            req.query.status;
        try {
            const article = await ArticleModel.findOneAndUpdate({
                $and: [{
                        _id: req.body.articleId
                    },
                    {
                        status: {
                            $in: ['Pending', 'Disapproved']
                        }
                    }
                ]
            }, {
                status: 'Published'
            });
            if (article) {
                req.flash("success", "Successfully. The article was published.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect(`/admin/articles?status=${status}`);
        } catch (error) {
            req.flash("fail", "Failed. An error occurred during the process.");
            return res.render(
                "error/admin-404", {
                    redirectLink: `/admin/articles?status=${status}`
                }
            );
        }
    },

    disapprove: async (req, res) => {
        const status = (req.query.status == null || req.query.status === 'All') ?
            'All' :
            req.query.status;
        try {
            const article = await ArticleModel.findOneAndUpdate({
                $and: [{
                        _id: req.body.articleId
                    },
                    {
                        status: {
                            $in: ['Pending', 'Published']
                        }
                    }
                ]
            }, {
                status: 'Disapproved'
            });
            if (article) {
                req.flash("success", "Successfully. The article was disapproved.");
            } else {
                req.flash("fail", "Failed. An error occurred during the process.");
            }
            return res.redirect(`/admin/articles?status=${status}`);
        } catch (error) {
            req.flash("fail", "Failed. An error occurred during the process.");
            return res.render(
                "error/admin-404", {
                    redirectLink: `/admin/articles?status=${status}`
                }
            );
        }
    }
}