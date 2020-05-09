const express = require('express')
const userRouter = express.Router()

userRouter.get('/', async (req,res) => {
    try {
        // const article_list = await ArticleModel.find()
        
        // res.render('user/index', article_list = article_list)   
    } catch (error) {
        res.render('user/index',error = error)   
    }
    res.render('user/index')
})

module.exports = userRouter