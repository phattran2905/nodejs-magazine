const AuthorModel = require('../models/AuthorModel');
const commonUtils = require('./commonUtils');
const mailUtils = require('./mailUtils');
const bcrypt = require('bcrypt');
const ArticleModel = require('../models/ArticleModel');

const validate = {
    // Express-validator requires returning a Promise
    // If invalid, return { Promise.reject() }
    // If valid , return { Promise.resolve() }
    checkExistentEmail: async (
        email = null, 
        {req} = {}) => {
        if(!email) return Promise.reject(false);

        const usernameFromReq = (req.params.username) 
            ? req.params.username 
            : null;
        
        try {
            const author = await AuthorModel.findOne({email: email});
            if (author){
                if (usernameFromReq && usernameFromReq === author.username){
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            }
            return Promise.reject(false);
        } catch(error) {
            return Promise.resolve(true);
        }
    },

    checkExistentUsername: async (
        username, 
        {req} = {}) => {
        if(!username) return Promise.reject(false);

        const usernameFromReq = (req.params.username) 
            ? req.params.username 
            : null;

        try {                
            const author = await AuthorModel.findOne({username: username});
            
            if(author){
                if (usernameFromReq && usernameFromReq === author.username){
                    return Promise.reject(false);
                }
                return Promise.resolve(true);
            }
            return Promise.reject(false);
        } catch (error) {
            return Promise.resolve(true);
        }
    },

    checkNotExistentUsername: async (username, {req} = {}) => {
        if(!username) return Promise.reject(false);

        const usernameFromReq = (req.params.username) 
            ? req.params.username 
            : null;

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
            return Promise.resolve(true);
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

    checkPresentPwd: async (pwd = null, {req} = {}) => {
        if(!pwd || typeof req.session.user === 'undefined') {return Promise.reject(false)};
        
        const userPwd = req.session.user.password;
        try {
            const match = await bcrypt.compare(pwd, userPwd);
            if (match) {return Promise.resolve(true);}

            return Promise.reject(false);
        } catch (error) {
            return Promise.reject(false);
        }
    },
    
}

const AuthorUtils = {
    getAuthorsWithNumOfArticles: async () => {
        const authors = await AuthorModel.find();
        for(let i = 0; i < authors.length; i++) {
            const articles = await ArticleModel.find({authorId: authors[i]._id});
            console.log(articles.length);
            authors[i].numOfArticles = articles.length;
        }
        
        console.log(authors);
        return authors;
    },

    getAuthorById: async (authorId = null) => {
        if (!authorId) {return null;}
        
        try{
            const author = await AuthorModel.findOne({_id: authorId});
            if (author) {
                const articlesByAuthor = await ArticleModel
                    .find({$and: [{status: 'Published'}, {authorId: authorId}]})
                    .populate({
                        path: 'categoryId',
                        select: '_id name'
                    })
                    .sort({'interaction.views': 'desc'});
                let numOfViews = 0;
                for(let i=0; i < articlesByAuthor.length; i++){
                    numOfViews+= articlesByAuthor[i].interaction.views;
                }

                return {
                    info: author,
                    articles: articlesByAuthor,
                    statistics: {
                        numOfArticles: articlesByAuthor.length,
                        numOfViews: numOfViews,
                        numOfFollowers: author.followers.length,
                    }
                }
            }

            return null;
        }catch(error){
            return null;
        }
    },

    update_avatar: async(author_id = null, {path, contentType, filename, size} = {}) => {
        if (!author_id || !path || !contentType || !filename || !size) 
            {return null;}

        try {
            const author = await AuthorModel.findById(author_id);
            
            if (author) {
                const updateQuery = await AuthorModel.updateOne(
                    {_id: author.id},
                    {
                        'profile.avatar_img': {
                            path: path,
                            contentType: contentType,
                            filename: filename,
                            size: size
                        }
                    }
                );
                return updateQuery;
            }
        } catch (error) {
            return null;
        }
        return null;
    },

    createNewAuthor: async (
        {username , email, pwd} = {} 
        ) => {
        if (!username || !email || !pwd) {return null;}

        try {
            const hashed_pwd = await bcrypt.hash(pwd, await bcrypt.genSalt(12));
            const verifyToken = await commonUtils.generateToken(username + email, 7); // valid in 7 days 
            const author = await AuthorModel.create({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashed_pwd,
                profile: {
                    fullname: "",
                    gender: "Male",
                    dateOfBirth: "",
                    phone: ""
                },
                verifyToken: {
                    token: verifyToken.tokenStr,
                    expiredOn: verifyToken.expiredOn
                }
              });
            
            return author;
        } catch (error) {
            return null;
        }
    },

    updateAuthorProfile: async function({fullname, username, gender, dob, phone}) {
        if (!fullname || !username || !gender || !dob || !phone) return null;

        try {
            const updateResponse = await AuthorModel.updateOne(
                {username: username},
                {
                    'profile.fullname': fullname,
                    'profile.gender': gender,
                    'profile.dateOfBirth': new Date(dob), // Parse it to UTC/GMT instead of locale time
                    'profile.phone': phone
                }
              );
              
            return updateResponse;    
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    changePwd: async function({id, new_password}) {
        if (!id || !new_password) return null;

        try {
            const hashed_pwd = await bcrypt.hash(new_password,await bcrypt.genSalt(12));
            const updateResponse = await AuthorModel.updateOne({_id: id},{
                password: hashed_pwd
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

    validate: validate
};

module.exports = AuthorUtils