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
        if (req.isUnauthenticated()){
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
        if (req.isUnauthenticated()){
            return next();
        }
        return res.redirect("/");
    },
    
}

module.exports =  authUtils;