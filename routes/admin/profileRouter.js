const router = require('express').Router();
const {
    showProfile, updateProfile, uploadAvatar, showChangePwdForm, changePwd
} = require('../../controllers/admin/profile.controller');

router.get('/profile', showProfile);

router.post('/profile', updateProfile);

router.post('/profile/upload_avatar', uploadAvatar);

router.get('/profile/change_password', showChangePwdForm);

router.post('/profile/change_password', changePwd)

module.exports = router;