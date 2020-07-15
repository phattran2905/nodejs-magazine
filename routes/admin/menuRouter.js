const authUtils = require('../../utils/authUtils')
const MenuModel = require('../../models/MenuModel');
const SubmenuModel = require('../../models/SubmenuModel');
const validation = require('../../validation/admin/validateMenu');
const menuUtils = require('../../utils/menuUtils');
const CategoryModel = require('../../models/CategoryModel');

module.exports = (adminRouter) => {
    adminRouter.get(
        '/menu',
        async (req, res) => {
            try {
                const menus = await MenuModel.find()
                    .populate({
                        path: 'categoryId',
                        select: '_id name'
                    });
                return res.render('admin/menu/menu_base',
                {
                    header: 'List of menus',
                    content: 'list',
                    menus: menus,
                    information: authUtils.getAdminProfile(req)
                });
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
        }
    );

    adminRouter.get(
        '/menu/add',
        async (req, res) => {
            try {
                const categories = await CategoryModel.find({status: 'Activated'});
                    
                return res.render('admin/menu/menu_base',
                {
                    header: 'Add new menu',
                    content: 'add',
                    categories: categories,
                    information: authUtils.getAdminProfile(req)
                });
            } catch (error) {
                return res.render(
                    "error/admin-404", 
                    {redirectLink: '/admin/menu'}
                );
            }
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
                        categoryId: req.body.categoryId, 
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
                const menu = await MenuModel
                    .findById(req.params.menuId)
                    .populate({
                        path: 'submenu',
                        sort: { display_order: 'asc'},
                        populate: {path: 'categoryId', select: '_id name'}
                    })
                    .populate({
                        path: 'categoryId',
                        select: '_id name'
                    });
                const categories = await CategoryModel.find({status: 'Activated'});

                if (menu) {
                    return res.render('admin/menu/menu_base',
                    {
                        header: 'Submenu',
                        content: 'submenu',
                        menu: menu,
                        categories: categories,
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
                const categories = await CategoryModel.find({status: 'Activated'});
                if (menu) {
                        
                    const { hasError, validInput, errors } = validation.result(req);

                    if(hasError) {
                        return res.render('admin/menu/menu_base',
                        {
                            header: 'Submenu',
                            content: 'submenu',
                            menu: menu,
                            categories: categories,
                            validInput: validInput,
                            errors: errors,
                            information: authUtils.getAdminProfile(req)
                        });
                    }
                    const submenu = await SubmenuModel.create(
                        {
                            name: req.body.submenu_name,
                            menuId: req.params.menuId,
                            categoryId: req.body.categoryId,
                            encoded_string: req.body.submenu_encoded_string.toLowerCase(),
                            display_order: req.body.submenu_display_order
                        }
                    );
                    if (submenu) {
                        menu.submenu.push(submenu._id); 
                        await menu.save();
                        req.flash('success', 'Successfully! The new menu was updated.');
                    }else {
                        req.flash('fail', 'Failed! An error occurred during the process.');
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
                
                if (menu) {
                    const submenu = menu.submenu;
                    const reducedSubmenu = submenu.filter((element) => {
                        return element != req.body.submenu_index
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
                const categories = await CategoryModel.find({status: 'Activated'});
                if (menu) {
                    return res.render('admin/menu/menu_base',
                    {
                        header: 'Update menu',
                        content: 'update',
                        menu: menu,
                        categories: categories,
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
            const categories = await CategoryModel.find({status: 'Activated'});
            const menu = await MenuModel.findById(req.params.id);

            try {
                const { hasError, validInput, errors } = validation.result(req);

                if(hasError) {
                    return res.render('admin/menu/menu_base',
                    {
                        header: 'Update menu',
                        content: 'update',
                        menu: menu,
                        categories: categories,
                        validInput: validInput,
                        errors: errors,
                        information: authUtils.getAdminProfile(req)
                    });
                }

                if (menu) {
                    const updatedMenu = await MenuModel.updateOne(
                        {_id: req.params.menuId},
                        {
                            name: validInput.name,
                            categoryId: validInput.categoryId,
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