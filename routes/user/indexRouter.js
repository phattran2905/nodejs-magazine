const router = require('express').Router();
const {
  showIndexPage, showAboutPage, showArticle, showArticlesByCategoryId, showAuthorPage,
  searchArticlesByTitle, showContactPage, showTermsAndPolicy, followAuthor, subscribeEmail
} = require('../../controllers/user/index.controller');

router.get(['/', '/home', '/index'], showIndexPage);

router.get('/author', showAuthorPage);

router.get('/article', showArticle);

router.post('/follow', followAuthor);

router.get('/subscribe', subscribeEmail);

router.get('/category', showArticlesByCategoryId);

router.get('/search', searchArticlesByTitle);

router.get('/about', showAboutPage);

router.get('/contact', showContactPage);

router.get(['/terms_of_services', '/privacy_policy'], showTermsAndPolicy);

module.exports = router;