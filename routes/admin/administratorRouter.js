const router = require('express').Router();
const { 
    showAdminList, showAddAdminForm, addAdmin, showUpdateAdminForm, updateAdmin,
    activateAdmin, deactivateAdmin, resetPassword, deleteAdmin
} = require('../../controllers/admin/administrator.controller');
const { checkAuthenticatedAdmin } = require("../../utils/authUtils");


router.get("/administrators", showAdminList);

router.get("/administrators/add", showAddAdminForm);

router.post("/administrators/add", addAdmin);

router.get("/administrators/update/:username", showUpdateAdminForm);

router.post("/administrators/update/:username", updateAdmin);

router.post("/administrators/activate/", activateAdmin);

router.post("/administrators/deactivate/", deactivateAdmin);

router.post("/administrators/reset_password/", resetPassword);

router.post("/administrators/delete/", deleteAdmin);

module.exports = router;