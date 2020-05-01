const express = require("express");
const adminRouter = express.Router();
const authUtils = require("../../utils/auth");

adminRouter.get("/",
authUtils.checkAuthenticatedAdmin,
(req, res) => {
  {
    res.render("admin/index")
  }
});

module.exports = adminRouter;
