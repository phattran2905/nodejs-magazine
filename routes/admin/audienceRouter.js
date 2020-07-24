const router = require('express').Router();
const { 
    showAudienceList, deleteAudience
} = require('../../controllers/admin/audience.controller');

router.get("/audiences", showAudienceList);

router.post("/audiences/delete/", deleteAudience);

module.exports = router;