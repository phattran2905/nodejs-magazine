
const AdminModel = require("../../models/AdministratorModel");


const loginWithRememberMe = async (req, res, next) => {
    if (!req.body.remember_me) {
      return next();
    }

    try {
      const newToken = require('nanoid').nanoid(64);
      const admin = await AdminModel.findOneAndUpdate({
        _id: req.user._id
      }, {
        remember_token: newToken
      });
      if (admin) {
        res.cookie('remember_me_adm', admin.remember_token, {
          path: '/admin',
          httpOnly: true,
          maxAge: 604800000
        });
      }
      return next();
    } catch (error) {
      return error;
    }
};

const redirectToDashboard =  async (req, res) => {
    req.session.admin = req.user;
    return res.redirect('/admin');
};

module.exports = {
    showLoginForm: (req,res) => {  
        return res.render("admin/auth/login");
    },

    login: [
        loginWithRememberMe, redirectToDashboard
    ],

    logout: (req, res) => {
        res.clearCookie('remember_me_adm', {
          path: '/admin'
        });
        req.logout();
        req.session.admin = undefined;
        return res.redirect('/admin/login');
      }

};