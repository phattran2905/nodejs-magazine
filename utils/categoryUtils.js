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
        
    },
    
    createNewCategory: async (
       { name } = {}
       ) => {
           if(!name) {return null;}

           try {
                const categoryObj = await CategoryModel.create({
                    name: name
                });

                return categoryObj;
            } catch (error) {
                return null;
            }
        },
};

module.exports = categoryUtils;
