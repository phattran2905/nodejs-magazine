const express = require('express');
const userRouter = express.Router();
const authUtils = require("../../utils/auth");

userRouter.get('/authors' , 
authUtils.checkAuthenticatedAdmin,
(req,res) => {
    
    return res.render('admin/author');
});

userRouter.post('/authors', (req,res) => {
    res.render('admin/author');
})

module.exports = userRouter;