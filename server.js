const express = require('express')
const app = express()
const path = require('path')
// router
const backendRouter = require('./routes/admin/index')

app.set('view engine','ejs')
// app.set('views','./views')
app.use('/static', express.static(path.join(__dirname,'public')))

app.use('/admin', backendRouter)


// SET PORT
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is listening on ${port || 5000}')
})