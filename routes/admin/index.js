const express = require("express");
const adminRouter = express.Router();
const authUtils = require("../../utils/auth");

adminRouter.get("/",
authUtils.checkAuthenticatedAdmin,
(req, res) => {
  {
    const loggedAdmin = {
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status
    };
    res.render("admin/index", {loggedAdmin: loggedAdmin})
  }
});

module.exports = adminRouter;
