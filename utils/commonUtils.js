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
    }
};

module.exports = commonUtils;