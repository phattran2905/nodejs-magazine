const express = require('express')
const router = express.Router()
const ArticleModel = require('../../models/ArticleModel')

router.get('/', async (req,res) => {
    try {
        // const article_list = await ArticleModel.find()
        
        // res.render('user/index', article_list = article_list)   
    } catch (error) {
        res.render('user/index',error = error)   
    }
    res.render('user/index')
})

router.get('/create', async (req,res) => {
    // try {
    //     ArticleModel.create({
    //         title: `Coronavirus: New Zealand nurse who treated Boris Johnson says it was 'surreal'`,
    //         summary: `A New Zealand nurse praised by Boris Johnson for helping to save his life said treating the prime minister was the "most surreal time in her life", her parents have said.`,
    //         thumbnail_img: 'default',
    //         category_id: '0',
    //         author_id: '0',
    //         text: `Jenny McGee, along with Luis Pitarma from Portugal, was praised by the PM for standing at his bedside "when things could have gone either way".

    //         Ms McGee's parents told Television New Zealand they are "exceptionally proud".
            
    //         They said she treated Mr Johnson like any other patient.
            
    //         Mr Johnson was discharged from St Thomas' Hospital in London on Sunday, one week after being admitted to be treated for coronavirus. He spent several nights in the intensive care unit where he was given oxygen.
            
    //         He said the NHS "has saved my life, no question" and paid tribute to many medics, singling out Ms McGee and Mr Pitarma specifically.` ,
    //     })
    // } catch (error) {
    //     res.render('user/index',error = error)   
    // }
    return res.render("user/create_article")
})


module.exports = router