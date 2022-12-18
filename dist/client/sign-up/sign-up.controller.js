"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpHandler = exports.showSignUpForm = void 0;
const showSignUpForm = (req, res) => {
    try {
        res.render('user/auth/signup', {
            menu_list: [],
            latestArticles: [],
            popularArticles: []
        });
    }
    catch (error) {
        res.render('error/user-404');
    }
};
exports.showSignUpForm = showSignUpForm;
const signUpHandler = async (req, res) => {
    try {
        res.render('error/user-404');
    }
    catch (error) {
        res.render('error/user-404');
    }
};
exports.signUpHandler = signUpHandler;
