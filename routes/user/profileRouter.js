const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');
const validateProfile = require('../../validation/validateProfile');
const AuthorUtils = require('../../utils/authorUtils');

module.exports = function(userRouter) {
    userRouter.get(
        '/profile',
        (req,res) => {
            const loggedAuthor = authUtils.getLoggedAuthor(req);
            const information = {
                username: loggedAuthor.username,
                email: loggedAuthor.email,
                fullname: loggedAuthor.profile.fullname,
                gender: loggedAuthor.profile.gender,
                dob: loggedAuthor.profile.dateOfBirth,
                phone: loggedAuthor.profile.phone,
                avatar_img: loggedAuthor.profile.avatar_img
            }
            
            const profilePage = {
                profile_content: 'information',
                content_header: 'information'
            }
            res.render('user/profile', {
                loggedUser: loggedAuthor,
                page: profilePage,
                information: information
            });
        }
    );

    userRouter.post(
        '/profile/information',
        async (req,res) => {
            // return console.log(req.body.gender);
            const reqInformation = {
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                gender: req.body.gender,
                dob: req.body.dob,
                phone: req.body.phone
            }
            const updatedQuery = await authorUtils.updateAuthorProfile(reqInformation);
            if (updatedQuery.n === 1 && updatedQuery.ok === 1){
                const reloadAuthorInfo = await authUtils.reloadLoggedUser(req, req.session.user._id);
                if(reloadAuthorInfo) {
                    req.flash('success', 'Successfully! Your changes were saved.');
                    return res.redirect('/profile');
                }
            }
            req.flash('fail', 'Failed! An error occurred during the process.');
            return res.redirect('/profile');
            
        }
    );

    userRouter.get(
        '/profile/change_password',
        (req, res) => {
            const loggedAuthor = authUtils.getLoggedAuthor(req);
            const profilePage = {
                profile_content: 'change_password',
                content_header: 'Change Password'
            }
            res.render('user/profile', {
                loggedUser: loggedAuthor,
                page: profilePage,
                // information: information
            });
        }
    );

    userRouter.post(
        '/profile/change_password',
        validateProfile.change_password,
        async (req, res) => {
            const { hasError, errors, validInput } = validateProfile.result(req);
            
            if(hasError) {
                console.log(errors);
                const profilePage = {
                    profile_content: 'change_password',
                    content_header: 'Change Password'
                };
                return  res.render('user/profile',{
                    errors: errors, 
                    validInput: validInput,
                    page: profilePage,
                });
            };
    
            
            const changePwdQuery = await authorUtils.changePwd({
                id: req.session.user._id,
                new_password: req.body.new_password
            });
            if(changePwdQuery.n ===1 && changePwdQuery.ok ===1) {
                const reloadAuthorInfo = await authUtils.reloadLoggedUser(req, req.session.user._id);
                if(reloadAuthorInfo) {
                    req.flash('success', 'Successfully! Your new password was saved.');
                    return res.redirect('/profile/change_password');
                }
            }

            req.flash('fail', 'Failed! An error occurred during the process.');
            return res.redirect('/profile/change_password');
            
        }
    );
};