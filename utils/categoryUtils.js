const CategoryModel = require('../models/CategoryModel');


const categoryUtils = {
    checkExistedName: async (name, {req}) => {
        const match = await CategoryModel.findOne({name: name});
        if (match) {
            if(typeof req.params.id !== 'undefined' && match.id === req.params.id ){
                return true;
            } 
            throw new Error("This name already existed.");
        }
        return true;
    },
    checkDuplicatedOrder: async (display_order, {req}) => {
        const match = await CategoryModel.findOne({displayOrder: display_order});
        if (match){
            if (typeof req.params.id !== 'undefined' && match.id === req.params.id){
                return true;
            }
            throw new Error("Display Order already existed.")
        }
        return true;
    },
    createNewCategory: async (name, display_order) => {
    try {
        const categoryObj = await CategoryModel.create({
            name: name, 
            displayOrder: display_order
          });
        
        return categoryObj;    
    } catch (error) {
        return console.error(error);
    }
},
};

module.exports = categoryUtils;
