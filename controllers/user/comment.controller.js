const CommentModel = require('../../models/CommentModel');
const ArticleModel = require('../../models/ArticleModel');
const commentUtils = require('../../utils/commentUtils');
const validation = require('../../validation/user/validateComment');

module.exports = {
    comment: [
        validation.add,
        async (req, res) => {
            try {
                const article = await ArticleModel.findOne({
                    $and: [{
                        status: 'Published',
                        _id: req.params.articleId
                    }]
                });
                if (article) {
                    const comment = await commentUtils.createNewArticle({
                        articleId: req.params.articleId,
                        text: req.body.text,
                        postedBy: req.body.name,
                        email: req.body.email
                    });

                    if (comment) {
                        return res.redirect(`/article?id=${req.params.articleId}`);
                    }
                }
                return res.render("error/user-404");
            } catch (error) {
                return res.render("error/user-404");
            }

        }
    ],

    interactToComment: async (req, res) => {
        if (req.params.interaction === 'like' || req.params.interaction === 'dislike') {
            const interaction = req.params.interaction;
            try {
                let comment = await CommentModel.findOne({
                    $and: [{
                        status: 'Public',
                        _id: req.params.commentId
                    }]
                });
                if (comment) {
                    if (interaction == 'like') {
                        comment.likes += 1
                    } else if (interaction == 'dislike') {
                        comment.dislikes += 1
                    };
                    await comment.save();
                    return res.redirect(`/article?id=${req.body.articleId}`);
                }
            } catch (error) {
                return res.render("error/user-404");
            }
        }
        return res.render("error/user-404");
    }

}