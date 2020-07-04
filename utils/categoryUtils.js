const CategoryModel = require('../models/CategoryModel');


const categoryUtils = {
    validate: {
        checkExistedName: async (
            name = null, 
            {req} = {} 
            ) => {
                if (!name) {return Promise.reject(false)} ;
                
                const cateIdFromReq = (req.params.id) 
                    ? req.params.id
                    : null;

                try {
                    const category = await CategoryModel.findOne({name: name});
                    if (category) {
                        if(cateIdFromReq && category.id === cateIdFromReq){
                            return Promise.reject(false);
                        } 
                        return Promise.resolve(true);
                    }
                    return Promise.reject(false);
                } catch (error) {
                    return Promise.resolve(true);
                }
        },
        checkDuplicatedOrder: async (
            display_order = null, 
            {req} = {}
            ) => {
                if(!display_order) {return Promise.reject(false)};
                
                const cateIdFromReq = (req.params.id) 
                    ? req.params.id
                    : null;

                try {
                    const category = await CategoryModel.findOne(
                        {displayOrder: display_order});
                    if (category){
                        if (cateIdFromReq && cateIdFromReq === category.id){
                            return Promise.reject(false);
                        }
                        return Promise.resolve(true);
                    }
                    return Promise.reject(false);
                } catch (error) {
                    return Promise.resolve(true);
                }
        },
    },
    
    createNewCategory: async (
       { name, display_order } = {}
       ) => {
           if(!name || !display_order) {return null;}

           try {
                const categoryObj = await CategoryModel.create({
                    name: name, 
                    displayOrder: display_order
                });

                return categoryObj;
            } catch (error) {
                return null;
            }
        },
};

module.exports = categoryUtils;
