const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');

module.exports = function(userRouter) {
    userRouter.get(
        '/profile',
        async (req,res) => {
            const loggedAuthor = authUtils.getLoggedAuthor(req);
            const profilePage = {
                profile_content: 'information',
                content_header: 'information'
            }
            res.render('user/profile', {
                loggedUser: loggedAuthor,
                page: profilePage
            });
        }
    );
};