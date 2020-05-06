
const authUtils = {
    checkAuthenticatedAdmin : (req,res,next) => {
        const successRedirectPath = req.path;
        req.successRedirectPath = successRedirectPath;
        if (req.isAuthenticated()){
            return next()
        }

        return res.redirect("/admin/login");
    },

    checkNotAuthenticatedAdmin : (req,res,next) => {
        const successRedirectPath = req.path;
        req.successRedirectPath = successRedirectPath;
        if (req.isAuthenticated()){
            return res.redirect("/admin");
        }
        
        return next()
    }
}

module.exports =  authUtils;