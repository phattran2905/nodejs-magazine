// const express = require('express');
// const userRouter = express.Router();

module.exports = function(userRouter, moduleArray) {

    userRouter.get('/', async (req,res) => {
        try {
            // const article_list = await ArticleModel.find()
            
            // res.render('user/index', article_list = article_list)
            console.log('user: ');
            console.log(req.session);
            // console.log(req.user);
            return res.send('logged');
        } catch (error) {
            res.render('user/index',error = error)
        }
        res.render('user/index')
    });

};