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
    checkFullnameValid: async(fullname = null) => {
        if (!fullname) return false;
        if(fullname.match(/\s/g)) {
            const wordsArr = fullname.split(" ");
            
            for (let i = 0; i < wordsArr.length; i++){
                if(wordsArr[i].match(/\W|\d/)) {return false};
            }

            return true;
        } else if (fullname.match(/\w/g)){
            return true;
        } else {
            return false;
        }
       
    }
};


module.exports = validationUtils;