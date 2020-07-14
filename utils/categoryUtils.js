const CategoryModel = require('../models/CategoryModel');
const ArticleModel = require('../models/ArticleModel');


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

    getNumOfArticleByCategory: async () => {
        let resultArr = Array();
        const categoryArr = await CategoryModel.find({status: 'Activated'}, '_id name');
        for (let i =0; i < categoryArr.length; i++) {
            resultArr.push({
                categoryId: categoryArr[i]._id,
                categoryName: categoryArr[i].name,
                numOfArticles: await ArticleModel
                    .find({$and: [{status: 'Published'},{categoryId:  categoryArr[i]._id}]}, '_id')
                    .count()
            })
        }
        
        return resultArr;
    }
};

module.exports = categoryUtils;
