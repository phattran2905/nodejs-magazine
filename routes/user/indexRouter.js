// const express = require('express');
// const userRouter = express.Router();

module.exports = function(userRouter, moduleArray) {

    userRouter.get('/',
      async (req,res) => { 
        if (typeof req.session.admin !== 'undefined' && req.session.admin ) {
          const loggedAdmin = {
            username: req.session.admin.username,
            email: req.session.admin.email,
            role: req.session.admin.role,
            status: req.session.admin.status
          }
        }
        return res.render('user/index');
    });

};