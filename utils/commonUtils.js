const bcrypt = require('bcrypt');
const AuthorModel = require('../models/AuthorModel');
const AudienceModel = require('../models/AudienceModel');

const commonUtils = {
    generateToken: async function (str, validIn = 7){
        let currentDate = new Date();
        const expiredDate = currentDate.setDate(currentDate.getDate() + validIn);
        try {
            const hashedToken = await bcrypt.hash(str, await bcrypt.genSalt(12));
            return { tokenStr: hashedToken, expiredOn: expiredDate};
        } catch (error) {
            return error;
        }
    },
    getLoggedAccount: async function (account)  {
        if (account) {
            const loggedAcc = {
                id: account.id,
                username: account.username,
                email: account.email,
                role: account.role, 
                status: account.status
            }
            return loggedAcc;
        }
        return null;
    },
    normalizeVerifyToken: function(verify_token) {
        if(verify_token){
            const normalizeToken = escape(verify_token).replace(/\./g,'DOT').replace(/\//g,'SPLASH').replace(/\\/g,'BACKSPLASH');
            return normalizeToken;
        }
        return null;
    },
    denormalizeVerifyToken: function(normalized_token){
        if(normalized_token){
            const rawToken = unescape(normalized_token.replace(/DOT/g,'.').replace(/SPLASH/g,'/').replace(/BACKSPLASH/g,'\\'));
            return rawToken;
        }
        return null;
    },
    castPromiseToBoolean: async function (promiseFunc, params) {
        if (typeof promiseFunc !== 'function') return null;

        let result = null;
        await promiseFunc([...params])
            .then(resolve => result = resolve)
            .catch(reject => result = reject);
        
        return result;
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
    makePagination: ({items, itemPerPage = 1, currentPage = 1} = {}) => {
        if(!items || !Array.isArray(items) || itemPerPage < 1 || currentPage < 1) {return null;}

        const numOfPages = Math.ceil(items.length / itemPerPage);
        if(currentPage > numOfPages) {return null;}
        
        const fromIndex = itemPerPage * (currentPage - 1);
         // omit -1 in (itemPerPage - 1) due to splice()
        const toIndex = fromIndex + itemPerPage;

        return {
            numOfPages: numOfPages,
            items: items.splice(fromIndex, toIndex),
            currentPage: currentPage,
            itemPerPage: itemPerPage
        };
    },
};

module.exports = commonUtils;