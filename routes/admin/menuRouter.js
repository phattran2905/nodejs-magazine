const authUtils = require('../../utils/authUtils')
const MenuModel = require('../../models/MenuModel');
const validation = require('../../validation/admin/validateMenu');
const menuUtils = require('../../utils/menuUtils');

module.exports = (adminRouter) => {
    adminRouter.get(
        '/menu',
        async (req, res) => {
            try {
                const menus = await MenuModel.find();
                return res.render('admin/menu/menu_base',
                {
                    header: 'List of menus',
                    content: 'list',
                    menus: menus,
                    information: authUtils.getAdminProfile(req)
                });
            } catch (error) {
                console.log(error)
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.get(
        '/menu/add',
        (req, res) => {
            return res.render('admin/menu/menu_base',
                {
                    header: 'Add new menu',
                    content: 'add',
                    information: authUtils.getAdminProfile(req)
                });
        }
    );

    adminRouter.post(
        '/menu/add',
        validation.add,
        async (req,res) => {
            const { hasError, validInput, errors } = validation.result(req);
            if(hasError) {
                return res.render('admin/menu/menu_base',
                {
                    header: 'Add new menu',
                    content: 'add',
                    validInput: validInput,
                    errors: errors,
                    information: authUtils.getAdminProfile(req)
                });
            }

            try {
                const addedMenu = await menuUtils.createNewMenu(
                    {
                        name: req.body.name, 
                        encoded_string: req.body.encoded_string.toLowerCase(), 
                        display_order: req.body.display_order 
                    });

                if (addedMenu) {
                    req.flash('success', 'Successfully! A new menu was created.')
                } else {
                    req.flash('fail', 'Failed! An error occurred during the process.')
                }
                return res.redirect('/admin/menu');
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }

        }
    );

    adminRouter.get(
        '/menu/:menuId/submenu',
        async (req, res) => {
            try {
                const menu = await MenuModel.findById(req.params.menuId);
                if (menu) {
                    return res.render('admin/menu/menu_base',
                    {
                        header: 'Submenu',
                        content: 'submenu',
                        menu: menu,
                        information: authUtils.getAdminProfile(req)
                    });
                }
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.post(
        '/menu/:menuId/submenu/',
        validation.submenu_add,
        async (req, res) => {

            try {
                const menu = await MenuModel.findById(req.params.menuId);
                if (menu) {
                        
                    const { hasError, validInput, errors } = validation.result(req);

                    if(hasError) {
                        return res.render('admin/menu/menu_base',
                        {
                            header: 'Submenu',
                            content: 'submenu',
                            menu: menu,
                            validInput: validInput,
                            errors: errors,
                            information: authUtils.getAdminProfile(req)
                        });
                    }

                    menu.submenu.push({
                        name: req.body.submenu_name,
                        encoded_string: req.body.submenu_encoded_string.toLowerCase(),
                        display_order: req.body.submenu_display_order
                    });

                    const updatedMenu = await menu.save();                    
                    if(updatedMenu) {
                        req.flash('success', 'Successfully! The new menu was updated.')
                    } else {
                        req.flash('fail', 'Failed! An error occurred during the process.')
                    }
                    return res.redirect(`/admin/menu/${menu._id.toString()}/submenu/`); 

                }
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.post(
        '/menu/:menuId/submenu/delete',
        async (req, res) => {
            try {
                const menu = await MenuModel.findOne({_id: req.params.menuId});
                console.log(menu)
                if (menu) {
                    const submenu = menu.submenu;
                    const reducedSubmenu = submenu.filter((index) => {
                        return index != req.body.submenu_index
                    })
                    menu.submenu = reducedSubmenu;
                    
                    const updatedMenu = await menu.save();                    
                    if(updatedMenu) {
                        req.flash('success', 'Successfully! The new submenu was deleted.')
                    } else {
                        req.flash('fail', 'Failed! An error occurred during the process.')
                    }
                    return res.redirect(`/admin/menu/${menu._id.toString()}/submenu/`); 

                }
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            } catch (error) {
                console.log(error)
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.get(
        '/menu/update/:id',
        async (req, res) => {
            try {
                const menu = await MenuModel.findById(req.params.id);
                if (menu) {
                    return res.render('admin/menu/menu_base',
                    {
                        header: 'Update menu',
                        content: 'update',
                        menu: menu,
                        information: authUtils.getAdminProfile(req)
                    });
                }
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.post(
        '/menu/update/:id',
        validation.add,
        async (req, res) => {
            const { hasError, validInput, errors } = validation.result(req);

            if(hasError) {
                const menu = await MenuModel.findById(req.params.id);
                return res.render('admin/menu/menu_base',
                {
                    header: 'Update menu',
                    content: 'update',
                    menu: menu,
                    validInput: validInput,
                    errors: errors,
                    information: authUtils.getAdminProfile(req)
                });
            }

            try {
                const menu = await MenuModel.findById(req.params.id);
                if (menu) {
                    const updatedMenu = await MenuModel.updateOne(
                        {_id: req.params.menuId},
                        {
                            name: validInput.name,
                            encoded_string: validInput.encoded_string.toLowerCase(),
                            display_order: validInput.display_order
                        }
                    );
                    if(updatedMenu) {
                        req.flash('success', 'Successfully! The new menu was updated.')
                    } else {
                        req.flash('fail', 'Failed! An error occurred during the process.')
                    }
                    return res.redirect('/admin/menu');
                }
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    )

    adminRouter.post(
        '/menu/activate',
        async (req, res) => {
            try {
                const menu = await MenuModel.findOneAndUpdate(
                    {$and: [{_id: req.body.id}, {status: 'Deactivated'}] },
                    {status: 'Activated'}
                );
                if (menu) {
                    req.flash('success', 'Successfully! The menu was activated.')
                } else {
                    req.flash('fail', 'Failed! An error occurred during the process.')
                }
                return res.redirect('/admin/menu');
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.post(
        '/menu/deactivate',
        async (req, res) => {
            try {
                const menu = await MenuModel.findOneAndUpdate(
                    {$and: [{_id: req.body.id}, {status: 'Activated'}] },
                    {status: 'Deactivated'}
                );
                if (menu) {
                    req.flash('success', 'Successfully! The menu was deactivated.')
                } else {
                    req.flash('fail', 'Failed! An error occurred during the process.')
                }
                return res.redirect('/admin/menu');
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.post(
        '/menu/delete',
        async (req, res) => {
            try {
                const menu = await MenuModel.findOneAndDelete({_id: req.body.id});
                if (menu) {
                    req.flash('success', 'Successfully! The menu was deleted.')
                } else {
                    req.flash('fail', 'Failed! An error occurred during the process.')
                }
                return res.redirect('/admin/menu');
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );
}