const CommentModel = require('../../models/CommentModel');
const authUtils = require('../../utils/authUtils');

module.exports = {
    showCommentList: async (req, res) => {
        return res.render(
            "admin/comment/comment_base", {
                header: 'List of comments',
                content: 'comment_list',
                comments: await CommentModel.find().sort({createdAt: 'desc'}),
                information: authUtils.getAdminProfile(req)
            });
    },

    showComment: async (req,res) => {
        return res.render('admin/comment/comment_base',{
            header: 'List of comments',
            content: 'comment_detail',
            comment: await CommentModel.findOne({_id: req.params.commentId}),
            information: authUtils.getAdminProfile(req)
        })
    },

    banComment: async (req, res) => {
        try {
            const comment = await CommentModel.findOneAndUpdate(
                {$and: [{status: 'Public'},{_id: req.body.id}]},
                {status: 'Banned'} );
                
            if(comment) {
                req.flash('success', 'Successfully! The comment was banned.');
            }else {
                req.flash('fail', 'Failed! An error occurred during the process.');
            }

            return res.redirect('/admin/comments');
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/comments'
                }
            );
        }
    },
    
    approveComment: async (req, res) => {
        try {
            const comment = await CommentModel.findOneAndUpdate(
                {$and: [{status: 'Banned'},{_id: req.body.id}]},
                {status: 'Public'} );

            if(comment) {
                req.flash('success', 'Successfully! The comment was now public.');
            }else {
                req.flash('fail', 'Failed! An error occurred during the process.');
            }

            return res.redirect('/admin/comments');
        } catch (error) {
            return res.render(
                "error/admin-404", {
                    redirectLink: '/admin/comments'
                }
            );
        }
    },
}