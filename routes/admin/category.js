const express = require('express')
const categoryRouter = express.Router()
const Category = require('../../models/category')

categoryRouter.get('/category/add', (req,res) => {{
    res.render('admin/add_category')
}});


categoryRouter.post('/category/add',async (req,res) => {{
    const display_order = parseInt(req.body.display_order) ? (req.body.display_order) : 1000
    try {
        console.log(req.body)
        await Category.create({
            name: req.body.category_name,
            display_order: display_order
        })
        res.redirect('/category/add')
    } catch (error) {
        console.log(req.body)
        res.sendStatus(404)
    }
}});

module.exports = categoryRouter;