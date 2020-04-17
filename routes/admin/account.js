const express = require('express');
const accountRouter = express.Router();
const AdminModel = require('../../models/admin');
const bcrypt = require('bcrypt');

accountRouter.get('/account/add', (req,res) =>{
    return res.render('admin/add_account');
});

accountRouter.post('/account/add', async (req,res) => {
    try {
        const hashed_pwd = await bcrypt.hash(req.body.admin_password,await bcrypt.genSalt(12));
        const adminAccount = await AdminModel.create({
            username: req.body.admin_username,
            email: req.body.admin_email,
            password: hashed_pwd
        });
        return res.redirect('/admin/account/add');
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
});

module.exports = accountRouter;