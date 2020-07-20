const router = require('express').Router();
const { 
    showAuthorList, showAddAuthorForm, addAuthor, showUpdateAuthorForm, updateAuthor,
    activateAuthor, deactivateAuthor, resetPassword, deleteAuthor
} = require('../../controllers/admin/author.controller');
const { checkAuthenticatedAdmin } = require("../../utils/authUtils");


router.get('/authors', showAuthorList);

router.get('/authors/add', showAddAuthorForm);

router.post('/authors/add', addAuthor);

router.get("/authors/update/:username", showUpdateAuthorForm);

router.post("/authors/update/:username", updateAuthor);

router.post("/authors/activate/", activateAuthor);

router.post("/authors/deactivate", deactivateAuthor);

router.post("/authors/reset_password/", resetPassword);

router.post("/authors/delete/", deleteAuthor);

module.exports = router;