const express = require('express')
const app = express()
const path = require('path')
const { Sequelize } = require('sequelize');

// router
const adminRouter = require('./routes/admin/index')
const userRouter = require('./routes/user/index')

// Connect to database
// const sequelize = new Sequelize('postgres://postgres:1234@@:5432/electronic_newspaper'); // Example for postgres;
const sequelize = new Sequelize('electronic_newspaper', 'postgres', '1234@@', {
  host: 'localhost',
  dialect: 'postgres'
});

(async () => {
    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

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