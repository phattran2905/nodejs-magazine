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

userRouter.get('/create', async (req,res) => {
    // try {
    // 
    // } catch (error) {
    //     res.render('user/index',error = error)   
    // }
    return res.render("user/create_article")
})


module.exports = userRouter