const AudienceModel = require('../models/AudienceModel');

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
    },

    isExistentAudienceEmail: async function(email = null){
        if (!email) {return false};

        try {
            const audience = await AudienceModel.findOne({email: email});
            if (audience){
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    
    isAlreadyFollower: async function(authorId= null, email = null){
        if (!email || !authorId) {return false};

        try {
            const author = await AuthorModel.findOne({_id: authorId});
            if (author){
                const audience = await AudienceModel.findOne({email: email});
                if(audience) {
                    for(let i = 0; i < author.followers.length; i++) {
                        if (author.followers[i]._id.toString() == audience._id.toString()){
                            return true;
                        }
                    }
                    return false;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
};


module.exports = validationUtils;