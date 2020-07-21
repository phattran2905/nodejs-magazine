const router = require('express').Router();
const {
  showIndexPage, showAboutPage, showArticle, showArticlesByCategoryId, searchArticlesByTitle, showContactPage, showTermsAndPolicy
} = require('../../controllers/user/index.controller');

router.get(['/', '/home', '/index'], showIndexPage);

router.get('/article', showArticle);

router.get('/category', showArticlesByCategoryId);

router.get('/search', searchArticlesByTitle);

router.get('/about', showAboutPage);

router.get('/contact', showContactPage);

router.get(['/terms_of_services', '/privacy_policy'], showTermsAndPolicy);

module.exports = router;