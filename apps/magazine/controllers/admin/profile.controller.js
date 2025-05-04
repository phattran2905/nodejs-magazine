
const upload = require('../../config/upload-setup');
const authUtils = require('../../utils/authUtils.js');
const adminUtils = require('../../utils/administratorUtils.js');
const validation = require('../../validation/admin/validateProfile');

module.exports = {
    showProfile: async (req, res) => {
        return res.render('admin/profile/profile_base', {
            header: 'Profile',
            content: 'profile',
            information: authUtils.getAdminProfile(req)
        });
    },

    updateProfile: [
        validation.profile,
        async (req, res) => {
            const {
                hasError,
                errors,
                validInput
            } = validation.result(req);

            if (hasError) {
                return res.render('admin/profile/profile_base', {
                    errors: errors,
                    validInput: validInput,
                    header: 'Profile',
                    content: 'profile',
                    information: authUtils.getAdminProfile(req)
                });
            };

            try {
                const updatedQuery = await adminUtils.updateProfile({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    phone: req.body.phone
                });

                if (updatedQuery && updatedQuery.n === 1 && updatedQuery.ok === 1) {
                    const reloadedInfo = await authUtils.reloadLoggedAdmin(req, req.session.admin._id);
                    if (reloadedInfo) {
                        req.flash('success', 'Successfully! Your changes were saved.');
                        return res.redirect('/admin/profile');
                    }
                }
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/admin/profile');

            } catch (error) {
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/admin/profile');
            }
        }
    ],

    uploadAvatar: [
        upload.single('avatar_img'),
        async (req, res) => {
            const information = authUtils.getAdminProfile(req);
            const updateQuery = await adminUtils.update_avatar(
                information.id, {
                    path: req.file.path,
                    contentType: req.file.mimetype,
                    filename: req.file.filename,
                    size: req.file.size
                });
            if (updateQuery && updateQuery.n === 1 && updateQuery.nModified === 1) {
                const reloaded_admin = await authUtils.reloadLoggedAdmin(req, information.id);
                if (reloaded_admin) {
                    const fs = require('fs');
                    const path = require('path');
                    fs.unlinkSync(path.join(process.cwd(), information.avatar_img.path));
                    req.flash('success', 'Successfully! Your profile image was saved.');
                    return res.redirect('/admin/profile');
                }
            }

            req.flash('fail', 'Failed! An error occurred during the process.');
            return res.redirect('/admin/profile');
        }
    ],

    showChangePwdForm: (req, res) => {
        res.render('admin/profile/profile_base', {
            header: 'Change password',
            content: 'change password',
            information: authUtils.getAdminProfile(req)
        });
    },

    changePwd: [
        validation.change_password,
        async (req, res) => {
            const {
                hasError,
                errors,
                validInput
            } = validation.result(req);

            if (hasError) {
                console.log(errors);
                console.log(validInput);
                return res.render('admin/profile/profile_base', {
                    errors: errors,
                    validInput: validInput,
                    header: 'Change password',
                    content: 'change password',
                    information: authUtils.getAdminProfile(req)
                });
            };

            try {
                const changePwdQuery = await adminUtils.changePwd({
                    id: req.session.admin._id,
                    new_password: req.body.new_password
                });

                if (changePwdQuery && changePwdQuery.n === 1 && changePwdQuery.ok === 1) {
                    const reloadInfo = await authUtils.reloadLoggedAdmin(req, req.session.admin._id);
                    if (reloadInfo) {
                        req.flash('success', 'Successfully! Your new password was saved.');
                        return res.redirect('/admin/profile/change_password');
                    }
                }

                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/admin/profile/change_password');

            } catch (error) {
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/profile/change_password');
            }
        }
    ],
}