// const authUtils = require("../../utils/authUtils");
// const AdminModel = require("../../models/AdministratorModel");

const router = require('express').Router();
const { indexController } = require('../../controllers/admin/index.controller');

router.get("/", indexController );

module.exports = router;