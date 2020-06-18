const express = require('express');
const accountRouter = express.Router();
const AdminModel = require('../../models/AdministratorModel');
const bcrypt = require('bcrypt');
const administratorUtils = require("../../utils/administratorUtils");

accountRouter.get('/account/add', async (req,res) =>{
   try {
        const account = {username: 'root', email: 'root@admin.root', pwd: '1234', role: 'SuperAdmin'};
        const result = await administratorUtils.createNewAdmin({...account});
        return res.send(result);
   } catch (error) {
       res.send(error);
   }
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