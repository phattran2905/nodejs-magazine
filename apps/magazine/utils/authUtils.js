const AuthorModel = require('../models/AuthorModel');
const AdminModel = require('../models/AdministratorModel');

const authUtils = {
    checkAuthenticatedAdmin : async (req, res, next) => {
        if (req.isAuthenticated() && req.session.admin){
            return next();
        }

        return res.redirect("/admin/login");
    },

    checkNotAuthenticatedAdmin : (req,res,next) => {
        if (req.isUnauthenticated() || typeof req.session.admin === 'undefined') {
            return next();
        }
        return res.redirect("/admin");
    },

    checkAuthenticatedAuthor : async (req, res, next) => {
        if (req.isAuthenticated() && req.session.user){
            return next();
        }

        return res.redirect("/login");
    },

    checkNotAuthenticatedAuthor : (req,res,next) => {
        if (req.isUnauthenticated() || typeof req.session.user === 'undefined'){
            return next();
        }
        return res.redirect("/home");
    },
    reloadLoggedAdmin: async (req, id ) => {
        try {
            const adminInfo = await AdminModel.findById(id);
            req.session.admin = adminInfo;
            return adminInfo;
        } catch(error) {
            return null;
        }
    },
    reloadLoggedUser: async (req, id ) => {
        try {
            const authorInfo = await AuthorModel.findById(id);
            req.session.user = authorInfo;
            return authorInfo;
        } catch(error) {
            return null;
        }
    },
    getAuthorProfile: (req) => {
        if(typeof req.session.user !== 'undefined' && req.session.user)
            {
                return {
                    id: req.session.user._id,
                    username: req.session.user.username,
                    email: req.session.user.email,
                    fullname: req.session.user.profile.fullname,
                    gender: req.session.user.profile.gender,
                    dob: req.session.user.profile.dateOfBirth,
                    phone: req.session.user.profile.phone,
                    avatar_img: req.session.user.profile.avatar_img
                }
            }
            
        return null;
    },
    getAdminProfile: (req) => {
        if(typeof req.session.admin !== 'undefined' && req.session.admin)
            {
                return {
                    id: req.session.admin._id,
                    username: req.session.admin.username,
                    email: req.session.admin.email,
                    fullname: req.session.admin.profile.fullname,
                    gender: req.session.admin.profile.gender,
                    dob: req.session.admin.profile.dateOfBirth,
                    phone: req.session.admin.profile.phone,
                    role: req.session.admin.role,
                    avatar_img: req.session.admin.profile.avatar_img
                }
            }
            
        return null;
    }
}

module.exports =  authUtils;