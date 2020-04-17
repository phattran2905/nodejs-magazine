const express = require('express')
const adminRouter = express.Router()

adminRouter.get('/', (req,res) => {{
    res.render('admin/index')
}})


module.exports = adminRouter