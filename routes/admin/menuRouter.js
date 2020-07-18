const router = require('express').Router();
const {checkAuthenticatedAdmin} = require('../../utils/authUtils');
const {
    showMenuList, showAddMenuForm, addMenu, showUpdateMenuForm, updateMenu,
    activateMenu, deactivateMenu, deleteMenu, showAddSubmenuForm, addSubmenu, deleteSubmenu
} = require('../../controllers/admin/menu.controller');
router.use(checkAuthenticatedAdmin);

router.get('/menu', showMenuList);

router.get('/menu/add', showAddMenuForm);

router.post('/menu/add', addMenu);

router.get('/menu/update/:id', showUpdateMenuForm);

router.post('/menu/update/:id', updateMenu)

router.post('/menu/activate', activateMenu);

router.post('/menu/deactivate', deactivateMenu);

router.post('/menu/delete', deleteMenu);

router.get('/menu/:menuId/submenu', showAddSubmenuForm);

router.post('/menu/:menuId/submenu/', addSubmenu);

router.post('/menu/:menuId/submenu/delete', deleteSubmenu);

module.exports = router;