const express = require('express')
const app = express()
const path = require('path')
// router
const adminRouter = require('./routes/admin/index')
const userRouter = require('./routes/user/index')

app.set('view engine','ejs')
// app.set('views','./views')
app.use('/static', express.static(path.join(__dirname,'public')))

// Routes
app.use('/', userRouter)
app.use('/admin', adminRouter)


// SET PORT
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is listening on ${port || 5000}')
})