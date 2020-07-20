const router = require('express').Router();
const {checkAuthenticatedAuthor} = require('../../utils/authUtils');
const {
    showProfile, updateProfile, uploadAvatar, showChangePwdForm, changePwd
} = require('../../controllers/user/profile.controller');


router.get('/profile', checkAuthenticatedAuthor, showProfile);

router.post('/profile', checkAuthenticatedAuthor, updateProfile);

router.post('/profile/upload_avatar', checkAuthenticatedAuthor, uploadAvatar)

router.get('/profile/change_password', checkAuthenticatedAuthor, showChangePwdForm);

router.post('/profile/change_password', checkAuthenticatedAuthor, changePwd);

module.exports = router;