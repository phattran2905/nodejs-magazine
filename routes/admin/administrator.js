const express = require("express");
const adminRouter = express.Router();
const AdminModel = require("../../models/AdministratorModel");
const authUtils = require("../../utils/auth");
const adminUtils = require("../../utils/administrator");
const {check, validationResult, matchedData} = require("express-validator");

adminRouter.get("/administrators", authUtils.checkAuthenticatedAdmin, async (req, res) => {
  const administrators = await AdminModel.find();
  res.render("admin/administrator", { administrators: administrators });
});

adminRouter.get(
    "/administrators/add", 
    authUtils.checkAuthenticatedAdmin,
    (req,res) => {
    
    res.render("admin/administrator_add");
});

adminRouter.post(
    "/administrators/add",
    [
        check('username').isAlphanumeric().withMessage("Only letters and numbers are allowed.")
            .trim().escape()
            .bail().custom(adminUtils.checkExistedUsername),
        check('email').isEmail().normalizeEmail().withMessage("Email is not valid.")
            .bail().custom(adminUtils.checkExistedEmail),
        check('password').isLength({min: 4}).withMessage('Password must be at least 4 characters.').escape(),
        check('role').not().isEmpty().withMessage("Assign a role for account.")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        const input = matchedData(req, {location: ['body']});
        if (!errors.isEmpty()) {
            return res.render("admin/administrator_add", {errors: errors.array(), input: input});
        }
        try {
            const adminObj = await adminUtils.createNewAdmin(
                req.body.username,
                req.body.email,
                req.body.password,
                req.body.role
            );

            if (adminObj) {
            req.flash("add", "Success");
            } else {
            req.flash("add", "Fail");
            }

            return res.redirect("/admin/administrators/add");
        } catch (error) {
            console.error(error);
            return res.sendStatus(404);
        }
});

adminRouter.get(
  "/administrators/update/:username",
  authUtils.checkAuthenticatedAdmin,
  async (req, res) => {
    try {
      const admin = await AdminModel.findOne({ username: req.params.username });
      console.log(admin);
      res.render("admin/administrator_update", { admin: admin });
    } catch (error) {
      return res.sendStatus(404);
    }
  }
);

adminRouter.post(
    "/administrators/update/:username", 
    [
        check('username'),
    ],
    async (req, res) => {
    try {
        console.log(req.body);
    } catch (error) {
        return res.sendStatus(404);
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
        res.redirect("/admin/administrators");
        }
    } catch (error) {
        return res.sendStatus(404);
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
        res.redirect("/admin/administrators");
        }
    } catch (error) {
        return res.sendStatus(404);
    }
});

adminRouter.post(
    "/administrators/delete/:username", 
    async (req, res) => {
    try {
        const adminObj = await AdminModel.findOneAndDelete({ username: username });
        if (adminObj) {
        res.flash("info", "success");
        } else {
        res.flash("info", "fail");
        }
        res.redirect("/admin/administrators");
    } catch (error) {
        return res.sendStatus(404);
    }
});

module.exports = adminRouter;
