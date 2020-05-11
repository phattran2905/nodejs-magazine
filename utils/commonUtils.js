const bcrypt = require('bcrypt');
const adminUtils = require('./administratorUtils');
// const adminUtils = require('./administrator');

const commonUtils = {
    generateToken: async function (str, validIn){
        let currentDate = new Date();
        const expiredDate = currentDate.setDate(currentDate.getDate() + 7);
        const hashedToken = await bcrypt.hash(str, await bcrypt.genSalt(12));
        return { tokenStr: hashedToken, expiredOn: expiredDate};
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
    checkPasswordConfirmation: function(password, {req}) {
        if (password !== req.body.confirm_password){
            throw new Error("Confirm Password does not match Password.");
        }
        return true;
    },
    normalizeVerifyToken: function(verify_token) {
        if(verify_token){
            const normalizeToken = escape(verify_token).replace('.','d').replace('/','spl');
            return normalizeToken;
        }
        return null;
    },
    denormalizeVerifyToken: function(normalized_token){
        if(normalized_token){
            const rawToken = unescape(normalized_token.replace('d','.').replace('spl','/'));
            return rawToken;
        }
        return null;
    }
};

module.exports = commonUtils;