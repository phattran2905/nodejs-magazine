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
    }
};

module.exports = commonUtils;