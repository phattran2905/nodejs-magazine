const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');
const validateProfile = require('../../validation/user/validateProfile');
const upload = require('../../config/upload-setup');

module.exports = function(userRouter) {
    userRouter.get(
        '/profile',
        (req,res) => {
            res.render('user/profile_base', {
                page: {
                    content: 'profile',
                    header: 'profile'
                },
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

    userRouter.post(
        '/profile',
        validateProfile.information,
        async (req,res) => {
            const { hasError, errors, validInput } = validateProfile.result(req);
            
            if(hasError) {
                return  res.render('user/profile_base',{
                    errors: errors, 
                    validInput: validInput,
                    page: {
                        content: 'profile',
                        header: 'profile'
                    },
                    information: authUtils.getAuthorProfile(req)
                });
            };
            
            try { 
                const updatedQuery = await authorUtils.updateAuthorProfile({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    phone: req.body.phone
                });
                
                if (updatedQuery && updatedQuery.n === 1 && updatedQuery.ok === 1){
                    const reloadAuthorInfo = await authUtils.reloadLoggedUser(req, req.session.user._id);
                    if(reloadAuthorInfo) {
                        req.flash('success', 'Successfully! Your changes were saved.');
                        return res.redirect('/profile');
                    }
                }
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/profile');

            } catch (error) {
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/profile');
            }
        }
    );
    
    userRouter.post(
        '/profile/upload_avatar',
        upload.single('avatar_img'),
        async (req, res) => {
            let information = authUtils.getAuthorProfile(req);

            const updateQuery = await authorUtils.update_avatar(
                information.id, 
                {
                    path: req.file.path,
                    contentType: req.file.mimetype,
                    filename: req.file.filename,
                    size: req.file.size
                });
            if (updateQuery && updateQuery.n === 1 && updateQuery.nModified === 1) {
                const reloaded_user = await authUtils.reloadLoggedUser(req, information.id);
                if(reloaded_user) {
                    req.flash('success', 'Successfully! Your profile image was saved.');
                    return res.redirect('/profile');
                }
            }
            
            req.flash('fail', 'Failed! An error occurred during the process.');
            return res.redirect('/profile');
        }
    )


    userRouter.get(
        '/profile/change_password',
        (req, res) => {
            res.render('user/profile_base', {
                page:  {
                    content: 'change_password',
                    header: 'Change Password'
                },
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

    userRouter.post(
        '/profile/change_password',
        validateProfile.change_password,
        async (req, res) => {
            const { hasError, errors, validInput } = validateProfile.result(req);
            
            if(hasError) {
                return  res.render('user/profile_base',{
                    errors: errors, 
                    validInput: validInput,
                    page: {
                        content: 'change_password',
                        header: 'Change Password'
                    },
                    information: authUtils.getAuthorProfile(req)
                });
            };
    
            try {
                const changePwdQuery = await authorUtils.changePwd({
                    id: req.session.user._id,
                    new_password: req.body.new_password
                });
                
                if(changePwdQuery && changePwdQuery.n ===1 && changePwdQuery.ok ===1) {
                    const reloadAuthorInfo = await authUtils.reloadLoggedUser(req, req.session.user._id);
                    if(reloadAuthorInfo) {
                        req.flash('success', 'Successfully! Your new password was saved.');
                        return res.redirect('/profile/change_password');
                    }
                }

                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/profile/change_password');

            } catch (error) {
                req.flash('fail', 'Failed! An error occurred during the process.');
                return res.redirect('/profile/change_password');
            }
            
        }
    );

    userRouter.get(
        '/profile/articles',
        (req, res) => {
            res.render('user/profile_base', {
                page:  {
                    content: 'articles',
                    header: 'Articles'
                },
                information: authUtils.getAuthorProfile(req)
            });
        }
    );

    userRouter.post(
        '/profile/articles',
        (req, res) => {
            
        }
    )
};