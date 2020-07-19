const router = require('express').Router();
const { checkAuthenticatedAuthor } = require('../../utils/authUtils');
const {
    showArticleList, previewArticle, showAddArticleForm, addArticle, showUpdateArticleForm,
    updateArticle, publishArticle, unpublishArticle, deleteArticle
} = require('../../controllers/user/article.controller');

// router.use(checkAuthenticatedAuthor);

router.get('/articles', showArticleList);

router.get('/articles/preview/:articleId', previewArticle);

router.get('/articles/add', showAddArticleForm);

router.post('/articles/add', addArticle);

router.get("/articles/update/:articleId", showUpdateArticleForm);

router.post("/articles/update/:articleId", updateArticle);

router.post("/articles/publish", publishArticle);

router.post("/articles/unpublish", unpublishArticle);

router.post("/articles/delete/", deleteArticle);

module.exports = router;