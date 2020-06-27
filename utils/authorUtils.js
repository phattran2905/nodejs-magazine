const AuthorModel = require('../models/AuthorModel');
const commonUtils = require('./commonUtils');
const mailUtils = require('./mailUtils');
const bcrypt = require('bcrypt');

const validate = {
    // Express-validator requires returning a Promise
    // If invalid, return { Promise.reject() }
    // If valid , return { Promise.resolve() }
    checkExistentEmail: async (email = null, {req} = {}) => {
        if(!email) return Promise.reject(false);

        let emailFromReq = null;
        if (req) emailFromReq = req.params.email;
        
        try {
            const author = await AuthorModel.findOne({email: email}).exec();
            if (author){
                if (emailFromReq && emailFromReq === author.email){
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            }
            return Promise.reject(false);
        } catch(error) {
            return Promise.reject(false);  
        }
    },
    checkExistentUsername: async (username, {req} = {}) => {
        if(!username) return Promise.reject(false);

        let usernameFromReq = null;
        if (req) usernameFromReq = req.params.username;

        try {                
            const author = await AuthorModel.findOne({username: username}).exec();
            
            if(author){
                if (usernameFromReq && usernameFromReq === author.username){
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            }
            return Promise.reject(false);
        } catch (error) {
            return Promise.reject(false);
        }
    },
    checkNotExistentUsername: async (username, {req} = {}) => {
        if(!username) return Promise.reject(false);

        let usernameFromReq = null;
        if (req) usernameFromReq = req.params.username;

        try {                
            const author = await AuthorModel.findOne({username: username}).exec();
            if(!author) return Promise.resolve(true);

            return Promise.reject(false);
        } catch (error) {
            return Promise.reject(false);
        }
    },
    checkExistentVerifyToken: async (normalizedToken = null) => {
        if (!normalizedToken) return Promise.reject(false);
        
        const verifyToken = commonUtils.denormalizeVerifyToken(normalizedToken.toString());
        try {
            const match = await AuthorModel.findOne({'verifyToken.token': verifyToken}).exec();
            if (match){
                return Promise.resolve(true);
            }
            return Promise.reject(false);    
        } catch (error) {
            return Promise.reject(false);
        }
        
    },
    checkUnexpiredVerifyToken: async (normalizedToken = null) => {
        if (!normalizedToken) return Promise.reject(false);

        const verifyToken = commonUtils.denormalizeVerifyToken(normalizedToken.toString());
        try {
            const author = await AuthorModel.findOne({'verifyToken.token': verifyToken}).exec();
            if(author){
                const currentTime = Date.now();
                if (currentTime <= author.verifyToken.expiredOn.getTime()){
                    return Promise.resolve(true);
                }
            }
            return Promise.reject(false);
        } catch (error) {
            return Promise.reject(false);
        }
    },
    checkValidVerifyToken: async (normalizedToken = null) => {
        if (!normalizedToken) return Promise.reject(false);

        // const verifyToken = commonUtils.denormalizeVerifyToken(normalizedToken.toString());
        const isExistent = await commonUtils.castPromiseToBoolean(validate.checkExistentVerifyToken,[normalizedToken]);
        const isUnexpired = await commonUtils.castPromiseToBoolean(validate.checkUnexpiredVerifyToken,[normalizedToken]);
        if (isExistent && isUnexpired){
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    },
    checkPendingVerifyTokenByEmail: async (email = null) => {
        if (!email) return Promise.reject(false);
        
        const author = await AuthorModel.findOne({email: email});
        if (author && author.verifyToken.token && author.verifyToken.expiredOn >= Date.now()) {
            return Promise.resolve(true);
        }
        return Promise.reject(false);
    },
    checkActivatedStatusByEmail: async (email = null, {req} = {}) => {
        if (!email) return Promise.reject(false);

        let emailFromReq = null;
        if (req) emailFromReq = req.params.email;
        
        try {
            const match = await AuthorModel.findOne(
                {$and: [
                    {email: email},
                    {status: 'Activated'}
                ]}).exec();
            
            if (match) {
                if(emailFromReq && emailFromReq === match.email) {
                    return Promise.reject(false);
                }
    
                return Promise.resolve(true);
            }
            return Promise.reject(false);
        } catch (error) {
            return Promise.reject(false);
        }
    },
}

const AuthorUtils = {
    getAuthorByVerifyToken: async (verifyToken) => {
        if (!verifyToken) return null;
        
        try{
            const author = await AuthorModel.findOne({'verifyToken.token': verifyToken}).exec();
            if (author) return author;
            return null;
        }catch(error){
            return null;
        }
    },
    createNewAuthor: async function(username = null, email = null, pwd = null) {
        if (!username || !email || !pwd) return null;

        let authorObj = { username: username, email: email};
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
            return null;
        }
    },
    updateAuthorProfile: async function({fullname, username, email, gender, dob, phone}) {
        if (!fullname || !username || !email || !gender || !dob || !phone) return null;

        try {
            const updateResponse = await AuthorModel.updateOne({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                profile: {
                    fullname: fullname,
                    gender: gender,
                    dateOfBirth: dob,
                    phone: phone
                }
              });
            
            return updateResponse;    
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    verifyAccountByToken: async (normalizedToken = null) => {
        if(!normalizedToken) return null;

        const rawToken = commonUtils.denormalizeVerifyToken(normalizedToken);
        try {
            const author = await AuthorModel.findOne(
                {$and: [
                    {'verifyToken.token': rawToken},
                    {status: 'Deactivated'}
                ]}).exec();
            if(author){
                const isValid = await commonUtils.castPromiseToBoolean(
                    validate.checkUnexpiredVerifyToken,
                    [normalizedToken] );
                if (isValid){
                    const responseQuery = await AuthorModel.updateOne(
                        {_id: author.id},
                        {
                            status: 'Activated',
                            'verifyToken.token': null,
                            'verifyToken.expiredOn': null
                        });
                    if(responseQuery.n === 1 && responseQuery.nModified === 1){
                        return author;
                    }
                    return null;
                }
            }
            return null;   
        } catch (error) {
            return null;
        }
    },
    sendVerification: async (email = null) => {
        if (!email) return null;

        try {
            const author = await AuthorModel.findOne(
                {$and: [
                    {email: email},
                    {status: 'Deactivated'}
                ]}).exec();
            if(!author) return null;

            const newVerifyToken = await commonUtils.generateToken(author.username + 'verification' + email, 7);
            const responseQuery = await AuthorModel.updateOne(
                {email: email},
                {
                    'verifyToken.token': newVerifyToken.tokenStr,
                    'verifyToken.expiredOn': newVerifyToken.expiredOn
                }).exec();
                
            if (responseQuery.n === 1 && responseQuery.nModified === 1){
                // send verification email
                const mailResponse = await mailUtils.sendVerificationEmail(email,newVerifyToken.tokenStr);
                
                if(mailResponse && mailResponse.accepted[0] === email){
                    return mailResponse;
                }
            }

            return null;
        } catch (error) {
            return null;
        }
    },
    sendResetPwd: async (email = null) => {
        if (!email) return null;

        try {
            const author = await AuthorModel.findOne({
                email: email,
                status: 'Activated'
            }).exec();
            if(!author) return null;

            const newVerifyToken = await commonUtils.generateToken(author.username + 'resetpwd' + email, 7);
            const responseQuery = await AuthorModel.updateOne(
                {email: email},
                {
                    'verifyToken.token': newVerifyToken.tokenStr,
                    'verifyToken.expiredOn': newVerifyToken.expiredOn
                }).exec();
            if (responseQuery.n === 1 && responseQuery.nModified === 1){
                // send verification email
                const mailResponse = await mailUtils.sendResetPwdEmail(email,newVerifyToken.tokenStr);
                
                if(mailResponse && mailResponse.accepted[0] === email){
                    return mailResponse;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    reset_pwd: async (normalizedToken=null, password=null) =>{
        if (!normalizedToken || !password) return null;

        const verifyToken = commonUtils.denormalizeVerifyToken(normalizedToken.toString());
        const author = await AuthorModel.findOne({
            'verifyToken.token': verifyToken, 
            status: 'Activated'
        }).exec();
        
        if (author) {
            const hashed_pwd = await bcrypt.hash(password,await bcrypt.genSalt(12));
            const responseQuery = await AuthorModel.updateOne(
                {_id: author.id},
                {
                    password: hashed_pwd,
                    'verifyToken.token': null,
                    'verifyToken.expiredOn': null
                }
            ).exec();
            
            if (responseQuery.n === 1 && responseQuery.nModified === 1) return author;
        }

        return null;
    },
    change_pwd: async (email, new_pwd) => {
        if (!email || !new_pwd) return null;
        
        try {
            const new_hashedPwd = await bcrypt.hash(new_pwd, await bcrypt.genSalt(12));
            const author = await AuthorModel.findOne({email: email}).exec();
            if (!author) return null;
            if (author.verifyToken.token && author.verifyToken.expiredOn) {
                author.verifyToken.token = null;
                author.verifyToken.expiredOn = null;
            } 
            author.password = new_hashedPwd;
            await author.save();
            return author;
        } catch (error) {
            return null;
        }
    },

    validate: validate
};

module.exports = AuthorUtils