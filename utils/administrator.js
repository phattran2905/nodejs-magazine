const AdminModel = require('../models/AdministratorModel');
const commonUtils = require('../utils/common');
const bcrypt = require('bcrypt');

const AdminUtils = {
    checkDifferent: async function(username, ) {
        const match = await AdminModel.findOne({username: username});
    },
    checkExistedEmail: async function(email) {
        const match = await AdminModel.findOne({email: email});
        if(match) {
            throw new Error('Email already existed.'); 
        }
        return true;
    },
    checkExistedUsername: async function(username) {
        const match = await AdminModel.findOne({username: username});
        if(match) {
            throw new Error('Username already existed.'); 
        }
        return true;
    },
    createNewAdmin: async function(username, email, pwd, role) {
        let adminObj = { username: username, email: email, role: role };
        try {
            adminObj.hashed_pwd = await bcrypt.hash(pwd,await bcrypt.genSalt(12));
            adminObj.verifyToken = await commonUtils.generateToken(username + email, 7); // valid in 7 days 
            const adminAccount = await AdminModel.create({
                username: adminObj.username,
                email: adminObj.email,
                password: adminObj.hashed_pwd,
                profile: {
                    fullname: "",
                    gender: "Male",
                    dateOfBirth: "",
                    phone: ""
                },
                verifyToken: {
                    token: adminObj.verifyToken.tokenStr,
                    expiredOn: adminObj.verifyToken.expiredOn
                },
                role: adminObj.role
              });
            
            return adminAccount;    
        } catch (error) {
            return console.error(error);
        }
    },
    updateAdmin: function() {

    }
};

module.exports = AdminUtils