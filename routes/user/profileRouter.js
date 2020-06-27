const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');

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
            console.log(information);
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
};