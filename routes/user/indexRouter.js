const authUtils = require('../../utils/authUtils');

module.exports = function(userRouter) {

    userRouter.get('/',
      async (req,res) => { 
        const information = authUtils.getAuthorProfile(req);
        
        return res.render('user/index', 
        {
          information: information
        });
    });

};