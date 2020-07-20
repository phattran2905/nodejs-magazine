const router = require('express').Router();
const authUtils = require("../../utils/authUtils");
const passport = require("passport");
const { showLoginForm, login, logout } = new require('../../controllers/admin/auth.controller');

router.get("/login",
  // authUtils.checkNotAuthenticatedAdmin,
  showLoginForm
);

router.post(
  "/login",
  // authUtils.checkNotAuthenticatedAdmin,
  passport.authenticate("auth-admin", 
  {
    failureRedirect: "/admin/login",
    failureFlash: true,
  }),
  login
);

router.get('/logout', logout);

module.exports = router;