const router = require('express').Router();
const {
    showCommentList, showComment, banComment, approveComment
} =  require('../../controllers/admin/comment.controller');

router.get('/comments', showCommentList);

router.get('/comments/:commentId', showComment);

router.post('/comments/ban', banComment);

router.post('/comments/approve', approveComment);

module.exports = router;