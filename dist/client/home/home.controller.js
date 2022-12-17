"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showContactPage = void 0;
async function showContactPage(req, res, next) {
    try {
        res.render('user/contact', {
            menu_list: [],
            latestArticles: [],
            popularArticles: [],
            information: {},
        });
    }
    catch (error) {
        res.render('error/user-404');
    }
}
exports.showContactPage = showContactPage;
