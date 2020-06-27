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
    getLoggedAuthor: (req) => {
        if (typeof req.session.user !== 'undefined' && req.session.user) {return req.session.user;}
    },
    getLoggedAdmin: (req) => {
        let loggedAdmin = null;
        if (typeof req.session.admin !== 'undefined' && req.session.admin){
            loggedAdmin = {
                username: req.session.admin.username,
                email: req.session.admin.email,
                role: req.session.admin.role,
                status: req.session.admin.status
            };
        }

        return loggedAdmin;
    },
    reloadLoggedUser: async (req, id ) => {
        try {
            const authorInfo = await AuthorModel.findById(id);
            req.session.user = authorInfo;
            return authorInfo;
        } catch(error) {
            return null;
        }
    }
}

module.exports =  authUtils;