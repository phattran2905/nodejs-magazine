const express = require("express");
const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  {
    res.redirect("/admin/login");
  }
});

module.exports = adminRouter;
