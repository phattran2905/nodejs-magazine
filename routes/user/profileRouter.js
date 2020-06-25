const authUtils = require('../../utils/authUtils');
const authorUtils = require('../../utils/authorUtils');

module.exports = function(userRouter) {
    userRouter.get(
        '/profile',
        async (req,res) => {
            const loggedAuthor = authUtils.getLoggedAuthor(req);
            res.render('user/profile', {loggedUser: loggedAuthor});
        }
    );
};