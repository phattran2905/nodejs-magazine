const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');
const validateProfile = require('../../validation/validateProfile');

module.exports = function(userRouter) {
    userRouter.get(
        '/profile',
        (req,res) => {
            const information = authUtils.getAuthorProfile(req);
            
            res.render('user/profile_base', {
                // loggedUser: information,
                page: {
                    profile_content: 'profile',
                    content_header: 'profile'
                },
                information: information
            });
        }
    );

    userRouter.post(
        '/profile',
        validateProfile.information,
        async (req,res) => {
            const { hasError, errors, validInput } = validateProfile.result(req);
            
            if(hasError) {
                const information = authUtils.getAuthorProfile(req);
                return  res.render('user/profile_base',{
                    errors: errors, 
                    validInput: validInput,
                    // loggedUser: ,
                    page: {
                        profile_content: 'profile',
                        content_header: 'profile'
                    },
                    information: information
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

    userRouter.get(
        '/profile/change_password',
        (req, res) => {
            const information = authUtils.getAuthorProfile(req);
            res.render('user/profile_base', {
                // loggedUser: loggedAuthor,
                page:  {
                    profile_content: 'change_password',
                    content_header: 'Change Password'
                },
                information: information
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
                        profile_content: 'change_password',
                        content_header: 'Change Password'
                    },
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
};