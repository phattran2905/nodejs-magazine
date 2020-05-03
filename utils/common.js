const bcrypt = require('bcrypt');

const commonUtils = {
    generateToken: async function (str, validIn){
        let currentDate = new Date();
        const expiredDate = currentDate.setDate(currentDate.getDate() + 7);
        const hashedToken = await bcrypt.hash(str, await bcrypt.genSalt(12));
        return { tokenStr: hashedToken, expiredOn: expiredDate};
    },
    getLoggedAccount: async function (account)  {
        const loggedAcc = {
            id: account._id,
            username: account.username,
            email: account.email,
            role: account.role,
            status: account.status
        }
        return loggedAcc;
    }
};

module.exports = commonUtils;