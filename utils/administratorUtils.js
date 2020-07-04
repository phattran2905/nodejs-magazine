const AdminModel = require('../models/AdministratorModel');
const commonUtils = require('./commonUtils');
const bcrypt = require('bcrypt');

const AdminUtils = {
    // Express-validator requires returning a Promise
    // If invalid, return { Promise.reject() }
    // If valid , return { Promise.resolve() }
    validate: {
        checkExistedEmail: async (
            email = null, 
            {req} = {}) => {
            if(!email) {return Promise.reject(false);}
            
            const usernameFromReq = (req.params.username) 
                ? req.params.username 
                : null;
            
            try {
                const admin = await AdminModel.findOne({
                    email: email
                });

                if (admin) {
                    if (usernameFromReq && admin.username === usernameFromReq) {
                        return Promise.reject(false);
                    }
                    return Promise.resolve(true);
                }
                return Promise.reject(false);
            } catch (error) {
                return Promise.reject(false);
            }
        },
        checkExistedUsername: async (
            username = null,
             {req} = {}) => {
            if (!username) {return Promise.reject(false)};

            const usernameFromReq = (req.params.username) 
                ? req.params.username
                : null;
            
            try {
                const admin = await AdminModel.findOne({
                    username: username
                });
    
                if (admin) {
                    if (usernameFromReq && admin.username === usernameFromReq) {
                        return Promise.reject(false);
                    }
                    return Promise.resolve(true);
                }
                return Promise.reject(false);
            } catch (error) {
                return Promise.reject(false);
            }
        },
        checkPresentPwd: async (pwd = null, {
            req
        } = {}) => {
            if (!pwd || typeof req.session.admin === 'undefined') {
                return Promise.reject(false)
            };

            const adminPwd = req.session.admin.password;
            try {
                const match = await bcrypt.compare(pwd, adminPwd);
                if (match) {
                    return Promise.resolve(true);
                }

                return Promise.reject(false);
            } catch (error) {
                return Promise.reject(false);
            }
        },
    },
    // 
    createNewAdmin: async ({username, email, pwd, role} = {}) => {
        if (!username || !email || !pwd || !role) {return null;}

        try {
            const hashed_pwd = await bcrypt.hash(pwd, await bcrypt.genSalt(12));
            const verifyToken = await commonUtils.generateToken(username + email, 7); // valid in 7 days
            const adminAccount = await AdminModel.create({
                username: username,
                email: email,
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
                },
                role: role,
                status: 'Activated'
            });
            
            return adminAccount;
        } catch (error) {
            return null;
        }
    },

    updateProfile: async (
        { fullname, username, gender, dob, phone } = {}
        ) => {

        if (!fullname || !username || !gender || !dob || !phone) {
            return null;
        }

        try {
            const updateResponse = await AdminModel.updateOne({
                username: username
            }, {
                'profile.fullname': fullname,
                'profile.gender': gender,
                'profile.dateOfBirth': new Date(dob), // Parse it to UTC/GMT instead of locale time
                'profile.phone': phone
            });

            return updateResponse;
        } catch (error) {
            return null;
        }
    },

    update_avatar: async (
        admin_id = null, 
        { path, contentType, filename, size } = {}
        ) => {
        if (!admin_id || !path || !contentType || !filename || !size) {
            return null;
        }

        try {
            const admin = await AdminModel.findById(admin_id);

            if (admin) {
                const updateQuery = await AdminModel.updateOne(
                    { _id: admin.id }, 
                    {
                        'profile.avatar_img': {
                            path: path,
                            contentType: contentType,
                            filename: filename,
                            size: size
                    }
                    });

                return updateQuery;
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    changePwd: async  (
        { id, new_password } = {}
        ) => {
        if (!id || !new_password) return null;
        
        try {
            const hashed_pwd = await bcrypt.hash(new_password, await bcrypt.genSalt(12));
            const updateResponse = await AdminModel.updateOne(
                { _id: id }, 
                {
                    password: hashed_pwd 
                });

            return updateResponse;
        } catch (error) {
            return null;
        }
    },
};

module.exports = AdminUtils;