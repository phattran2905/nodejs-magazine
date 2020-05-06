const express = require("express");
const adminRouter = express.Router();
const AdminModel = require("../../models/AdministratorModel");
const authUtils = require("../../utils/authUtils");
const adminUtils = require("../../utils/administratorUtils");
const commonUtils = require("../../utils/commonUtils");
const {body, validationResult, matchedData} = require("express-validator");

adminRouter.use(authUtils.checkAuthenticatedAdmin);

adminRouter.get(
    "/administrators", 
    async (req, res) => {
    const administrators = await AdminModel.find();
    res.render(
        "admin/administrator/administrator",
        { 
            administrators: administrators, 
            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
        });
});

adminRouter.get(
    "/administrators/add", 
    (req,res) => {
    
    res.render(
        "admin/administrator/administrator_add",
        {
            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
        });
});

adminRouter.post(
    "/administrators/add",
    [
        body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.")
            .trim().escape()
            .bail().custom(adminUtils.checkExistedUsername),
        body('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(adminUtils.checkExistedEmail),
        body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters.').trim().escape(),
        body('role').not().isEmpty().withMessage("Assign a role for account.")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const validInput = matchedData(req, {location: ['body']});
        if (!errors.isEmpty()) {
            return res.render(
                "admin/administrator/administrator_add", 
                {
                    errors: errors.array(), 
                    validInput: validInput,
                    loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                });
        }
        try {
            const adminObj = await adminUtils.createNewAdmin(
                req.body.username,
                req.body.email,
                req.body.password,
                req.body.role
            );

            if (adminObj) {
                req.flash("addSuccess", "Successfully. A new administrator was added.");
            } else {
                req.flash("addFail", "Failed. An error occurred during the process.");
            }

            return res.redirect("/admin/administrators/add");
        } catch (error) {
            return res.sendStatus(404).render('pages/404');
        }
});

adminRouter.get(
  "/administrators/update/:username",
  async (req, res) => {
    try {
      const admin = await AdminModel.findOne({ username: req.params.username });
      if(admin) {
        return res.render(
            "admin/administrator/administrator_update", 
              { 
                  admin: admin,
                  loggedAdmin:  commonUtils.getLoggedAccount(req.user)
              });
      }
      return res.render("pages/404");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
  }
);

adminRouter.post(
    "/administrators/update/:username", 
    [
        body('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.").trim()
            .bail().custom(adminUtils.checkExistedUsername),
        body('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(adminUtils.checkExistedEmail),
        body('role').not().isEmpty().withMessage("Must assign a role for the account.")
    ],
    async (req, res) => {
        try {
            const admin = await AdminModel.findOne({ username: req.params.username });
            if (admin){
                const errors = validationResult(req);
                const validInput = matchedData(req, {location: ['body']});

                if (!errors.isEmpty()) {
                    return res.render(
                        "admin/administrator/administrator_update", 
                        {
                            errors: errors.array(), 
                            validInput: validInput, 
                            admin: admin,
                            loggedAdmin:  commonUtils.getLoggedAccount(req.user)
                        });
                }
                const updatedAdmin = await AdminModel.findOneAndUpdate(
                    {_id: admin.id},
                    {
                        username: req.body.username,
                        email: req.body.email,
                        role: req.body.role
                    },{new: true}); // Return the updated object

                if (updatedAdmin){
                    req.flash('updateSuccess', 'Successfully. All changes were saved.');
                    return res.redirect("/admin/administrators/update/" + updatedAdmin.username);
                }else {
                    req.flash('updateFail', 'Failed. An error occurred during the process.');
                    return res.redirect("/admin/administrators/update/" + admin.username);
                }

            } else {
                req.flash('updateFail', 'Failed. An error occurred during the process.');
                return res.redirect("/admin/administrators/update/" + req.params.username);
            }
            
        } catch (error) {
            return res.sendStatus(404).render('pages/404');
        }
});

adminRouter.post(
    "/administrators/activate/:username", 
    async (req, res) => {
    try {
        const adminObj = await AdminModel.findOne({ username: req.params.username });
        if (adminObj && adminObj.status === "Deactivated") {
            adminObj.status = "Activated";
            await adminObj.save();

            req.flash("statusSuccess", "Successfully. The status was changed to 'Activated'");
        } else {
            req.flash("statusFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/administrators");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

adminRouter.post(
    "/administrators/deactivate/:username", 
    async (req, res) => {
    try {
        const adminObj = await AdminModel.findOne({ username: req.params.username });
        if (adminObj && adminObj.status === "Activated") {
            adminObj.status = "Deactivated";
            await adminObj.save();
            req.flash("statusSuccess", "Successfully. The status was changed to 'Deactivated'");
        } else {
            req.flash("statusFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/administrators");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

adminRouter.post(
    "/administrators/reset_password/", 
    async (req, res) => {
    try {
        const adminObj = await AdminModel.findByIdAndUpdate({  _id: req.body.id },{ password: 'Reset Password' });
        if (adminObj) {
            req.flash("resetSuccess", "Successfully. A link was sent to email for setting up a new password.");
        } else {
            req.flash("resetFail", "Failed. An error occurred during the process.");
        }
        return res.redirect("/admin/administrators");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

adminRouter.post(
    "/administrators/delete/", 
    async (req, res) => {
    try {
        const adminObj = await AdminModel.findByIdAndDelete({ _id: req.body.id });
        
        if (adminObj) {
            req.flash("deleteSuccess", "Successfully. The administrator was removed from the database.");
        } else {
            req.flash("deleteFail", "Failed. An error occurred during the process");
        }
        return res.redirect("/admin/administrators");
    } catch (error) {
        return res.sendStatus(404).render('pages/404');
    }
});

module.exports = adminRouter;
