// const express = require('express');
// const userRouter = express.Router();

module.exports = function(userRouter) {

    userRouter.get('/',
      async (req,res) => { 
        let loggedUser;
        if (typeof req.session.user !== 'undefined' && req.session.user ) {
          loggedUser = {
            username: req.session.user.username,
            email: req.session.user.email,
            role: req.session.user.role,
            status: req.session.user.status
          }
        }
        
        return res.render('user/index', {loggedUser: loggedUser});
    });

};