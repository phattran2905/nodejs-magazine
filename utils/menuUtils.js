const MenuModel = require('../models/MenuModel');

module.exports = {
    validate: {
        checkExistentName: async(name, {req} = {}) => {
            if (!name) {return Promise.reject(false);}
            const idFromReq = (req.params.id != null)
                ? req.params.id
                : null;

            try {
                const menu = await MenuModel.findOne({name: name});
                if (menu) {
                    if (idFromReq && idFromReq == menu._id){
                        return Promise.reject(false);
                    }
                    return Promise.resolve(true);
                }
                return Promise.reject(false);
            } catch (error) {
                return Promise.resolve(true);
            }
        },
        checkExistentDisplayOrder: async (display_order, {req} ={}) => {
            if (!display_order) return (Promise.reject(false));
            const idFromReq = (req.params.id != null)
                ? req.params.id
                : null;
            try {
                const menu = await MenuModel.findOne({display_order: display_order});
                if(menu) {
                    if (idFromReq && idFromReq == menu._id){
                        return Promise.reject(false);
                    }
                    return Promise.resolve(true);
                }
                return Promise.reject(false);
            } catch (error) {
                return Promise.resolve(true);
            }
        },
        checkExistentEncodedString: async (encoded_string, {req} ={}) => {
            if (!encoded_string) return (Promise.reject(false));
            const idFromReq = (req.params.id != null)
                ? req.params.id
                : null;
            try {
                const menu = await MenuModel.findOne({encoded_string: encoded_string});
                if(menu) {
                    if (idFromReq && idFromReq == menu._id){
                        return Promise.reject(false);
                    }
                    return Promise.resolve(true);
                }
                return Promise.reject(false);
            } catch (error) {
                return Promise.resolve(true);
            }
        },
        submenu: {
            checkExistentName: async(name, {req} = {}) => {
                if (!name) {return Promise.reject(false);}
                const menuId = req.params.menuId;
                try {
                    const menu = await MenuModel.findOne({_id: menuId});
                    if (menu) {
                        const submenu = menu.submenu;
                        for(let i =0; i < submenu.length; i++) {
                            if (submenu[i].name == name) {
                                return Promise.resolve(true);
                            }
                        }
                        return Promise.reject(false);
                    }
                    return Promise.reject(false);
                } catch (error) {
                    return Promise.resolve(true);
                }
            },
            checkExistentDisplayOrder: async (display_order, {req} ={}) => {
                if (!display_order) return (Promise.reject(false));
                const menuId = req.params.menuId;
                try {
                    const menu = await MenuModel.findOne({_id: menuId});
                    if(menu) {
                        const submenu = menu.submenu;
                        for(let i =0; i < submenu.length; i++) {
                            if (submenu[i].display_order == display_order) {
                                return Promise.resolve(true);
                            }
                        }
                        return Promise.reject(false);
                    }
                    return Promise.reject(false);
                } catch (error) {
                    return Promise.resolve(true);
                }
            },
            checkExistentEncodedString: async (encoded_string, {req} ={}) => {
                if (!encoded_string) return (Promise.reject(false));
                const menuId = req.params.menuId;
                try {
                    const menu = await MenuModel.findOne({_id: menuId});
                    if(menu) {
                        const submenu = menu.submenu;
                        for(let i =0; i < submenu.length; i++) {
                            if (submenu[i].encoded_string == encoded_string) {
                                return Promise.resolve(true);
                            }
                        }
                        return Promise.reject(false);
                    }
                    return Promise.reject(false);
                } catch (error) {
                    return Promise.resolve(true);
                }
            },
        }
    },

    createNewMenu: async (
        {name, categoryId, encoded_string, display_order} = {}
    ) => {
        if (!name || !encoded_string || !categoryId || !display_order) {return null;}

        try {
            const newMenu = await MenuModel.create({
                name: name,
                categoryId: categoryId,
                encoded_string: encoded_string,
                display_order: display_order
            })
            return newMenu;
        } catch (error) {
            return null;
        }
    },
    getMenuList: async () => {
        try {
                
            const menuList = await MenuModel.find({status: 'Activated'})
            .populate({
                path: 'submenu'
            })
            .sort({display_order: 'asc'});

            return menuList;
        } catch (error) {
            return null;
        }
    }
}