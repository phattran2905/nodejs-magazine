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
        }
    },

    createNewMenu: async (
        {name, display_order} = {}
    ) => {
        if (!name || !display_order) {return null;}

        try {
            const newMenu = await MenuModel.create({
                name: name,
                display_order: display_order
            })
            console.log(newMenu);
            return newMenu;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
}