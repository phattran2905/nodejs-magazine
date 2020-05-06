const AuthorModel = require('../models/AuthorModel');
const commonUtils = require('./commonUtils');
const bcrypt = require('bcrypt');

const AuthorUtils = {
    checkExistedEmail: async function(email, {req}) {
        const match = await AuthorModel.findOne({email: email});
        if(match) {
            if (typeof req.params.username !== 'undefined' && match.username === req.params.username) {
                return true;
            }
            throw new Error('Email already existed.'); 
        }
        return true;
    },
    checkExistedUsername: async function(username, {req}) {
        const match = await AuthorModel.findOne({username: username});
        if(match) {
            if (typeof req.params.username !== 'undefined' && match.username === req.params.username) {
                return true;
            }
            throw new Error('Username already existed.'); 
        }
        return true;
    },
    createNewAuthor: async function(username, email, pwd, role) {
        let authorObj = { username: username, email: email, role: role };
        try {
            authorObj.hashed_pwd = await bcrypt.hash(pwd,await bcrypt.genSalt(12));
            authorObj.verifyToken = await commonUtils.generateToken(username + email, 7); // valid in 7 days 
            const authorAccount = await AuthorModel.create({
                username: authorObj.username.toLowerCase(),
                email: authorObj.email.toLowerCase(),
                password: authorObj.hashed_pwd,
                profile: {
                    fullname: "",
                    gender: "Male",
                    dateOfBirth: "",
                    phone: ""
                },
                verifyToken: {
                    token: authorObj.verifyToken.tokenStr,
                    expiredOn: authorObj.verifyToken.expiredOn
                }
              });
            
            return authorAccount;    
        } catch (error) {
            return console.error(error);
        }
    },
    updateAuthor: function() {

    }
};

module.exports = AuthorUtils