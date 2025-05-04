const router = require('express').Router();
const {
    comment, interactToComment
} = require('../../controllers/user/comment.controller');

router.post('/comment/:articleId', comment);

router.post('/comment/:interaction/:commentId', interactToComment);

module.exports = router;