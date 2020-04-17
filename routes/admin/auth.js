const express = require('express');
const authRouter = express.Router();


authRouter.get('/login', (req,res) => {
    return res.render('auth/login');
});

authRouter.post('/login', async (req,res) => {
    
});

module.exports = authRouter;