const router = require('express').Router();
const {
    showArticleList, preview,  publish, disapprove
} = require('../../controllers/admin/article.controller');
const { checkAuthenticatedAdmin } = require('../../utils/authUtils');


router.get('/articles', showArticleList);

router.get('/articles/preview/:id', preview);

router.post('/articles/publish', publish);

router.post('/articles/disapprove', disapprove);

module.exports = router;