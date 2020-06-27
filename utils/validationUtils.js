const AuthorModel = require('../models/AuthorModel');

const validationUtils = {
    checkMatchedPassword: function(password, {req}) {
        if (password === req.body.password){
            return true;
        }
        return false;
    },
    checkMatchedNewPassword: function(password, {req}) {
        if (password === req.body.new_password){
            return true;
        }
        return false;
    },
};


module.exports = validationUtils;