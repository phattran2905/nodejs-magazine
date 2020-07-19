const router = require('express').Router();
const {checkAuthenticatedAdmin} = require('../../utils/authUtils');
const {
    showCategoryList, showAddCategoryForm, addCategory, showUpdateCategoryForm, updateCategory,
    activateCategory, deactivateCategory, deleteCategory
} = require('../../controllers/admin/category.controller');

// router.use(checkAuthenticatedAdmin);

router.get('/categories', showCategoryList);

router.get('/categories/add', showAddCategoryForm)

router.post('/categories/add', addCategory)

router.get("/categories/update/:id", showUpdateCategoryForm);

router.post("/categories/update/:id", updateCategory);

router.post("/categories/activate", activateCategory);

router.post("/categories/deactivate", deactivateCategory);

router.post("/categories/delete/", deleteCategory);

module.exports = router;