export async function showContactPage(req, res, next) {
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
