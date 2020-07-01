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
        // const successRedirectPath = req.path;
        // req.successRedirectPath = successRedirectPath;
        if (req.isUnauthenticated() || (req.isAuthenticated && req.session.admin)){
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
        // const successRedirectPath = req.path;
        // req.successRedirectPath = successRedirectPath;
        if (req.isUnauthenticated() || (req.isAuthenticated && req.session.user)){
            return next();
        }
        return res.redirect("/");
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
                    avatar_img: {
                        path: req.session.user.profile.avatar_img.path,
                        filename: req.session.user.profile.avatar_img.filename,
                        contentType: req.session.user.profile.avatar_img.contentType
                    }
                }
            }
            
        return null;
    }
}

module.exports =  authUtils;